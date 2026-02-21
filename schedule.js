// ===== 周排班表功能 =====

let employeeCounter = 0;
let weekDates = [];

// DOM Elements
const weekStartDateInput = document.getElementById('weekStartDate');
const updateWeekBtn = document.getElementById('updateWeekBtn');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const scheduleTableBody = document.getElementById('scheduleTableBody');
const scheduleExportBtn = document.getElementById('scheduleExportBtn');
const scheduleClearBtn = document.getElementById('scheduleClearBtn');

// ===== Feature Flags =====
const ENABLE_LEAVE_SECTION = true; // 特別休假（前端 + PDF）
const ENABLE_COMP_SECTION  = true; // 加班補休（前端 + PDF）

// 初始化週期
function initializeWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = 週日, 1 = 週一, ...
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 調整到週一
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    
    weekStartDateInput.value = monday.toISOString().split('T')[0];
    updateWeekDates();
}

// 更新週期日期
function updateWeekDates() {
    const startDate = new Date(weekStartDateInput.value);
    weekDates = [];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        weekDates.push(date);
        
        // 更新表頭日期顯示
        const dayHeader = document.getElementById(`day${i}`);
        if (dayHeader) {
            const dateDisplay = dayHeader.querySelector('.date-display');
            const month = date.getMonth() + 1;
            const day = date.getDate();
            dateDisplay.textContent = `${month}/${day}`;
        }
    }
}

// 格式化日期為中文
function formatDateChinese(date) {
    const year = date.getFullYear() - 1911;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}

// 格式化日期為簡短格式
function formatDateShort(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
}

// 新增員工行
function addEmployeeRow() {
    employeeCounter++;
    const rowId = `employee-${employeeCounter}`;
    const row = document.createElement('tr');
    row.id = rowId;
    row.className = 'employee-row';
    
    // 姓名欄位
    const nameCell = document.createElement('td');
    nameCell.className = 'name-col';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'employee-name';
    nameInput.placeholder = '請輸入姓名';
    nameInput.dataset.employeeId = employeeCounter;
    nameCell.appendChild(nameInput);
    
    // 7天的排班輸入
    const dayCells = [];
    for (let i = 0; i < 7; i++) {
        const dayCell = document.createElement('td');
        dayCell.className = 'day-col';
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'shift-input';
        input.placeholder = '';
        input.dataset.day = i;
        input.dataset.employeeId = employeeCounter;
        
        dayCell.appendChild(input);
        dayCells.push(dayCell);
    }
    
    // 刪除按鈕
    const actionCell = document.createElement('td');
    actionCell.className = 'action-col';
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-delete';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = '刪除此員工';
    deleteBtn.onclick = () => deleteEmployeeRow(rowId);
    actionCell.appendChild(deleteBtn);
    
    // 組裝行
    row.appendChild(nameCell);
    dayCells.forEach(cell => row.appendChild(cell));
    row.appendChild(actionCell);
    
    scheduleTableBody.appendChild(row);
    
    // 儲存到 localStorage
    saveScheduleData();
}

// 刪除員工行
function deleteEmployeeRow(rowId) {
    if (confirm('確定要刪除此員工嗎？')) {
        const row = document.getElementById(rowId);
        if (row) {
            row.remove();
            saveScheduleData();
        }
    }
}

// 獲取排班資料
function getScheduleData() {
    const data = {
        weekStart: weekStartDateInput.value,
        weekDates: weekDates.map(d => formatDateShort(d)),
        employees: []
    };
    
    const rows = scheduleTableBody.querySelectorAll('.employee-row');
    rows.forEach(row => {
        const nameInput = row.querySelector('.employee-name');
        const name = nameInput ? nameInput.value.trim() : '';
        
        if (name) {
            const shifts = [];
            for (let i = 0; i < 7; i++) {
                const input = row.querySelector(`.shift-input[data-day="${i}"]`);
                shifts.push(input ? input.value.trim() : '');
            }
            
            data.employees.push({
                name: name,
                shifts: shifts
            });
        }
    });
    
    return data;
}

// 儲存排班資料
function saveScheduleData() {
    const data = getScheduleData();
    localStorage.setItem('scheduleData', JSON.stringify(data));
}

// 載入排班資料
function loadScheduleData() {
    const saved = localStorage.getItem('scheduleData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            
            // 載入週期
            if (data.weekStart) {
                weekStartDateInput.value = data.weekStart;
                updateWeekDates();
            }
            
            // 載入員工資料
            if (data.employees && data.employees.length > 0) {
                scheduleTableBody.innerHTML = '';
                data.employees.forEach(emp => {
                    addEmployeeRow();
                    const lastRow = scheduleTableBody.lastElementChild;
                    const nameInput = lastRow.querySelector('.employee-name');
                    if (nameInput) {
                        nameInput.value = emp.name;
                    }
                    
                    emp.shifts.forEach((shift, dayIndex) => {
                        const input = lastRow.querySelector(`.shift-input[data-day="${dayIndex}"]`);
                        if (input) {
                            input.value = shift;
                        }
                    });
                });
            }
        } catch (e) {
            console.error('載入排班資料失敗:', e);
        }
    }
}

// 匯出排班表 PDF
function exportSchedulePDF() {
    const data = getScheduleData();
    
    if (data.employees.length === 0) {
        alert('請至少新增一名員工');
        return;
    }
    
    const weekStart = new Date(data.weekStart);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const htmlContent = getSchedulePDFHtml(data, weekStart, weekEnd);
    
    const printWindow = window.open('', '_blank', 'width=1000,height=700');
    
    if (!printWindow) {
        alert('請允許彈出視窗以匯出 PDF');
        return;
    }
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
        }, 250);
    };
}

// 生成排班表 PDF HTML
function getSchedulePDFHtml(data, weekStart, weekEnd) {
    const weekStartStr = formatDateChinese(weekStart);
    const weekEndStr = formatDateChinese(weekEnd);
    const weekRange = `${weekStartStr} 至 ${weekEndStr}`;
    
    let tableRows = '';
    data.employees.forEach(emp => {
        let shiftsHtml = '';
        emp.shifts.forEach(shift => {
            shiftsHtml += `<td>${shift || ''}</td>`;
        });
        
        tableRows += `
            <tr>
                <td class="emp-name">${emp.name}</td>
                ${shiftsHtml}
            </tr>
        `;
    });
    
    let dayHeaders = '';
    const dayNames = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
    data.weekDates.forEach((date, index) => {
        dayHeaders += `<th>${dayNames[index]}<br>${date}</th>`;
    });
    
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>周排班表</title>
<style>
@page { size: A4 landscape; margin: 15mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
    font-family: "Noto Sans TC", "Microsoft JhengHei", "微軟正黑體", sans-serif;
    font-size: 12px;
    color: #000;
    background: #fff;
    padding: 20px;
}
.title { 
    text-align: center; 
    font-size: 20px; 
    font-weight: bold; 
    margin-bottom: 15px; 
}
.week-range {
    text-align: center;
    font-size: 14px;
    margin-bottom: 20px;
    color: #555;
}
table { 
    width: 100%; 
    border-collapse: collapse; 
    margin: 0 auto;
}
th, td { 
    border: 2px solid #333; 
    padding: 10px 8px; 
    text-align: center;
    font-size: 11px;
}
th { 
    background: #e0e0e0; 
    font-weight: bold; 
}
.emp-name {
    background: #f5f5f5;
    font-weight: 600;
    min-width: 80px;
}
tbody td {
    font-weight: 500;
}
</style>
</head>
<body>
    <div class="title">周排班表</div>
    <div class="week-range">${weekRange}</div>
    <table>
        <thead>
            <tr>
                <th style="width: 100px;">姓名</th>
                ${dayHeaders}
            </tr>
        </thead>
        <tbody>
            ${tableRows}
        </tbody>
    </table>
</body>
</html>`;
}

// 清除排班資料
function clearScheduleData() {
    if (confirm('確定要清除所有排班資料嗎？')) {
        scheduleTableBody.innerHTML = '';
        employeeCounter = 0;
        localStorage.removeItem('scheduleData');
    }
}

// Event Listeners
updateWeekBtn.addEventListener('click', () => {
    updateWeekDates();
    saveScheduleData();
});

addEmployeeBtn.addEventListener('click', addEmployeeRow);

scheduleExportBtn.addEventListener('click', exportSchedulePDF);

scheduleClearBtn.addEventListener('click', clearScheduleData);

// 當排班輸入改變時儲存
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('shift-input') || e.target.classList.contains('employee-name')) {
        saveScheduleData();
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeWeek();
    loadScheduleData();
});

