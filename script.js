// ===== DOM Elements =====
const form = {
    // Basic Info
    year: document.getElementById('year'),
    month: document.getElementById('month'),
    name: document.getElementById('name'),
    position: document.getElementById('position'),
   account: document.getElementById('account') || { value: '' },
    payDate: document.getElementById('payDate'),
    
    // Salary Structure (A)
    baseSalary: document.getElementById('baseSalary'),
    mealAllowance: document.getElementById('mealAllowance'),
    attendanceBonus: document.getElementById('attendanceBonus'),
    positionAllowance: document.getElementById('positionAllowance'),
    teaBonus: document.getElementById('teaBonus'),

    // Part-time Salary (A for parttime)
    parttimeMinutes: document.getElementById('parttimeMinutes'),
    parttimeWage: document.getElementById('parttimeWage'),
    parttimeTotal: document.getElementById('parttimeTotal'),    
    
    // Overtime (B)
    weekdayOT: document.getElementById('weekdayOT'),
    holidayOT: document.getElementById('holidayOT'),
    restDayOT: document.getElementById('restDayOT'),
    unusedLeaveWage: document.getElementById('unusedLeaveWage'),
    expiredCompWage: document.getElementById('expiredCompWage'),
    
    // Deductions (C)
    laborInsurance: document.getElementById('laborInsurance'),
    healthInsurance: document.getElementById('healthInsurance'),
    welfareFund: document.getElementById('welfareFund'),
    voluntaryPension: document.getElementById('voluntaryPension'),
    personalLeave: document.getElementById('personalLeave'),
    sickLeave: document.getElementById('sickLeave'),
    
    // Leave Info
    leaveStartDate: document.getElementById('leaveStartDate'),
    leaveEndDate: document.getElementById('leaveEndDate'),
    deferredLeaveDays: document.getElementById('deferredLeaveDays'),
    annualLeaveDays: document.getElementById('annualLeaveDays'),
    usedLeaveDays: document.getElementById('usedLeaveDays'),
    remainingLeaveDays: document.getElementById('remainingLeaveDays'),
    leaveDeadline: document.getElementById('leaveDeadline'),
    
    // Comp Time Info
    compDeadline: document.getElementById('compDeadline'),
    prevMonthComp: document.getElementById('prevMonthComp'),
    thisMonthCompChoice: document.getElementById('thisMonthCompChoice'),
    thisMonthCompUsed: document.getElementById('thisMonthCompUsed'),
    expiredCompHours: document.getElementById('expiredCompHours'),
    remainingCompHours: document.getElementById('remainingCompHours')
};

// Display Elements
const subtotalA = document.getElementById('subtotalA');
const subtotalB = document.getElementById('subtotalB');
const subtotalC = document.getElementById('subtotalC');
const netPay = document.getElementById('netPay');

// Buttons
const previewBtn = document.getElementById('previewBtn');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');
const closeModal = document.getElementById('closeModal');
const modalExportBtn = document.getElementById('modalExportBtn');

// Modal
const previewModal = document.getElementById('previewModal');
const pdfContent = document.getElementById('pdfContent');

// ===== Utility Functions =====
function getNumber(element) {
    return parseFloat(element.value) || 0;
}

function formatCurrency(amount) {
    return '$' + amount.toLocaleString('zh-TW');
}

function payMonthToPayDateString(value) {
    // 允許輸入：YYYY-MM、YYYY-MM-DD、YYYY/MM/DD
    if (!value) return '';

    // 如果是 YYYY/MM/DD → 轉成 YYYY-MM-DD
    const normalized = value.replaceAll('/', '-');

    // 取前 7 碼當 YYYY-MM
    const ym = normalized.slice(0, 7);

    // 回傳固定 10 號
    return `${ym}-10`;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear() - 1911;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}

function isParttime() {
    return (form.position?.value || '') === '計時';
}

function updateParttimeTotal() {
    if (!isParttime()) return;

    const minutes = parseFloat(form.parttimeMinutes?.value) || 0;
    const wage = parseFloat(form.parttimeWage?.value) || 0;

    const hours = minutes / 60;
    const total = Math.ceil(hours * wage);   // ✅ 無條件進位

    if (form.parttimeTotal) form.parttimeTotal.value = total;
}

function updateEmploymentUI() {
    const fulltimeGroup = document.getElementById('fulltimeBaseSalaryGroup');
    const parttimeGroup = document.getElementById('parttimeSalaryGroup');

    if (!fulltimeGroup || !parttimeGroup) return;

    if (isParttime()) {
        fulltimeGroup.style.display = 'none';
        parttimeGroup.style.display = '';
        updateParttimeTotal();
    } else {
        fulltimeGroup.style.display = '';
        parttimeGroup.style.display = 'none';
    }

    updateCalculations();
}

// ===== Calculation Functions =====
function calculateSubtotalA() {
    const position = (form.position?.value || '');

    // 計時：直接用 (時數 or 分鐘) * 時薪 算 base
    let base = 0;
    if (position === '計時') {
    const wage = parseFloat(form.parttimeWage?.value) || 0;
    const minutes = parseFloat(form.parttimeMinutes?.value) || 0;
    base = (minutes / 60) * wage;
    } else {
        // 正職：用底薪
        base = getNumber(form.baseSalary);
    }

    return Math.ceil(
    base +
    getNumber(form.mealAllowance) +
    getNumber(form.attendanceBonus) +
    getNumber(form.positionAllowance) +
    getNumber(form.teaBonus)
    );
}

function calculateSubtotalB() {
    return getNumber(form.weekdayOT) +
           getNumber(form.holidayOT) +
           getNumber(form.restDayOT) +
           getNumber(form.unusedLeaveWage) +
           getNumber(form.expiredCompWage);
}

function calculateSubtotalC() {
    return getNumber(form.laborInsurance) +
           getNumber(form.healthInsurance) +
           getNumber(form.welfareFund) +
           getNumber(form.voluntaryPension) +
           getNumber(form.personalLeave) +
           getNumber(form.sickLeave);
}

function calculateNetPay() {
    return Math.ceil(
        calculateSubtotalA() +
        calculateSubtotalB() -
        calculateSubtotalC()
    );
}

function calculateRemainingComp() {
    return getNumber(form.prevMonthComp) +
           getNumber(form.thisMonthCompChoice) -
           getNumber(form.thisMonthCompUsed) -
           getNumber(form.expiredCompHours);
}

function updateCalculations() {
    subtotalA.textContent = formatCurrency(calculateSubtotalA());
    subtotalB.textContent = formatCurrency(calculateSubtotalB());
    subtotalC.textContent = formatCurrency(calculateSubtotalC());
    netPay.textContent = formatCurrency(calculateNetPay());
    form.remainingCompHours.value = calculateRemainingComp();
}

// ===== PDF Generation =====
function getFormData() {
    return {
        year: form.year.value || '○',
        month: form.month.value || '○',
        name: form.name.value || '',
        position: form.position.value || '',
        account: (form.account?.value) || '',
        payDate: formatDate(payMonthToPayDateString(form.payDate.value)),

        showLeave: document.getElementById('toggleLeave')?.checked ?? false,
        showComp: document.getElementById('toggleComp')?.checked ?? false,

        parttimeMinutes: form.parttimeMinutes?.value || '',
        parttimeHourMinText: minutesToHourMinText(form.parttimeMinutes?.value),

        parttimeHours: form.parttimeHours?.value || '',
        parttimeWage: form.parttimeWage?.value || '',
        parttimeTotal: formatCurrency(parseFloat(form.parttimeTotal?.value) || 0),
        salaryBaseDisplay: formatCurrency(isParttime() ? (parseFloat(form.parttimeTotal?.value) || 0) : getNumber(form.baseSalary)),
        
        baseSalary: formatCurrency(getNumber(form.baseSalary)),
        mealAllowance: formatCurrency(getNumber(form.mealAllowance)),
        attendanceBonus: formatCurrency(getNumber(form.attendanceBonus)),
        positionAllowance: formatCurrency(getNumber(form.positionAllowance)),
        teaBonus: formatCurrency(getNumber(form.teaBonus)),
        
        weekdayOT: formatCurrency(getNumber(form.weekdayOT)),
        holidayOT: formatCurrency(getNumber(form.holidayOT)),
        restDayOT: formatCurrency(getNumber(form.restDayOT)),
        unusedLeaveWage: formatCurrency(getNumber(form.unusedLeaveWage)),
        expiredCompWage: formatCurrency(getNumber(form.expiredCompWage)),
        
        laborInsurance: formatCurrency(getNumber(form.laborInsurance)),
        healthInsurance: formatCurrency(getNumber(form.healthInsurance)),
        welfareFund: formatCurrency(getNumber(form.welfareFund)),
        voluntaryPension: formatCurrency(getNumber(form.voluntaryPension)),
        personalLeave: formatCurrency(getNumber(form.personalLeave)),
        sickLeave: formatCurrency(getNumber(form.sickLeave)),
        
        subtotalA: formatCurrency(calculateSubtotalA()),
        subtotalB: formatCurrency(calculateSubtotalB()),
        subtotalC: formatCurrency(calculateSubtotalC()),
        netPay: formatCurrency(calculateNetPay()),
        
        leavePeriod: form.leaveStartDate.value && form.leaveEndDate.value 
            ? `${formatDate(form.leaveStartDate.value)}－${formatDate(form.leaveEndDate.value)}`
            : '',
        deferredLeaveDays: form.deferredLeaveDays.value || '○',
        annualLeaveDays: form.annualLeaveDays.value || '○',
        usedLeaveDays: form.usedLeaveDays.value || '○',
        remainingLeaveDays: form.remainingLeaveDays.value || '○',
        leaveDeadline: form.leaveDeadline.value || '',
        
        compDeadline: form.compDeadline.value || '',
        prevMonthComp: form.prevMonthComp.value || '○',
        thisMonthCompChoice: form.thisMonthCompChoice.value || '○',
        thisMonthCompUsed: form.thisMonthCompUsed.value || '○',
        expiredCompHours: form.expiredCompHours.value || '○',
        remainingCompHours: calculateRemainingComp() || '○'
    };
}

function minutesToHourMinText(minutesValue) {
    const minutes = parseInt(minutesValue, 10);
    if (!minutes || minutes <= 0) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0 && m > 0) return `${h}小時${m}分`;
    if (h > 0) return `${h}小時`;
    return `${m}分`;
}

function getPDFHtml(data) {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${data.year}年${data.month}月薪資發放明細表</title>
<style>
@page { size: A4; margin: 15mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
    font-family: "Noto Sans TC", "Microsoft JhengHei", "微軟正黑體", "PingFang TC", sans-serif;
    font-size: 11px;
    line-height: 1.4;
    color: #000;
    background: #fff;
}
.container { padding: 10px; }
.title { 
    text-align: center; 
    font-size: 18px; 
    font-weight: bold; 
    margin-bottom: 15px; 
}
table { 
    width: 100%; 
    border-collapse: collapse; 
    margin-bottom: 12px; 
}
th, td { 
    border: 1px solid #000; 
    padding: 5px 6px; 
    font-size: 10px;
    vertical-align: middle;
}
th { 
    background: #e0e0e0; 
    font-weight: bold; 
    text-align: center; 
}
.text-center { text-align: center; }
.text-right { text-align: right; }
.bg-light { background: #f5f5f5; }
.bg-gray { background: #e8e8e8; }
.total-box { 
    width: 250px; 
    margin: 15px auto; 
}
.total-box td { 
    padding: 10px 12px; 
    border: 2px solid #000; 
}
.net-amount { 
    font-size: 16px; 
    font-weight: bold; 
}
.note { 
    font-size: 9px; 
    margin-bottom: 8px; 
}
.small-table th, .small-table td {
    font-size: 9px;
    padding: 4px 5px;
}
</style>
</head>
<body>
<div class="container">
    <div class="title">${data.year}年${data.month}月薪資發放明細表</div>
    
    <table>
        <tr>
            <td class="bg-light text-center" style="width:8%"><b>姓名</b></td>
            <td style="width:14%">${data.name}</td>
            <td class="bg-light text-center" style="width:8%"><b>職位</b></td>
            <td style="width:14%">${data.position}</td>
            <td class="bg-light text-center" style="width:10%"><b>發薪日期</b></td>
            <td style="width:16%">${data.payDate}</td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th colspan="2">約定薪資結構</th>
                <th colspan="2"></th>
                <th colspan="2">應代扣項目</th>
            </tr>
            <tr>
                <th style="width:18%">項目</th>
                <th style="width:15%">金額</th>
                <th style="width:18%">項目</th>
                <th style="width:15%">金額</th>
                <th style="width:18%">項目</th>
                <th style="width:16%">金額</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-center">${data.position === '計時' ? '計時薪資' : '底薪'}</td>
                <td class="text-right">
                    ${data.salaryBaseDisplay}
                    ${data.position === '計時' ? `<div style="font-size:9px; text-align:right; margin-top:2px;">(${data.parttimeHourMinText ? data.parttimeHourMinText : (data.parttimeMinutes ? `${data.parttimeMinutes}分鐘` : '')} × ${data.parttimeWage} 元)</div>` : ``}
                </td>
                <td class="text-center">平日加班費</td>
                <td class="text-right">${data.weekdayOT}</td>
                <td class="text-center">就保費</td>
                <td class="text-right">${data.laborInsurance}</td>
            </tr>
            <tr>
                <td class="text-center">外送津貼</td>
                <td class="text-right">${data.mealAllowance}</td>
                <td class="text-center">休假日加班費</td>
                <td class="text-right">${data.holidayOT}</td>
                <td class="text-center">健保費</td>
                <td class="text-right">${data.healthInsurance}</td>
            </tr>
            <tr>
                <td class="text-center">全勤獎金</td>
                <td class="text-right">${data.attendanceBonus}</td>
                <td class="text-center">休息日加班費</td>
                <td class="text-right">${data.restDayOT}</td>
                <td class="text-center">職工福利金</td>
                <td class="text-right">${data.welfareFund}</td>
            </tr>
            <tr>
                <td class="text-center">職務津貼</td>
                <td class="text-right">${data.positionAllowance}</td>
                <td class="text-center">未休特別休假工資</td>
                <td class="text-right">${data.unusedLeaveWage}</td>
                <td class="text-center">勞工自願提繳退休金</td>
                <td class="text-right">${data.voluntaryPension}</td>
            </tr>
            <tr>
                <td class="text-center">問茶獎金</td>
                <td class="text-right">${data.teaBonus}</td>
                <td class="text-center"></td>
                <td class="text-right"></td>
                <td class="text-center"></td>
                <td class="text-right"></td>
            </tr>
            <tr>
                <td rowspan="2" class="text-center bg-light">非固定<br>支付項目</td>
                <td rowspan="2"></td>
                <td class="text-center">届期未補休折發工資</td>
                <td class="text-right">${data.expiredCompWage}</td>
                <td class="text-center">事假</td>
                <td class="text-right">${data.personalLeave}</td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td class="text-center">病假</td>
                <td class="text-right">${data.sickLeave}</td>
            </tr>
            <tr class="bg-gray">
                <td class="text-center"><b>小計(A)</b></td>
                <td class="text-right"><b>${data.subtotalA}</b></td>
                <td class="text-center"><b>小計(B)</b></td>
                <td class="text-right"><b>${data.subtotalB}</b></td>
                <td class="text-center"><b>小計(C)</b></td>
                <td class="text-right"><b>${data.subtotalC}</b></td>
            </tr>
        </tbody>
    </table>

    <table class="total-box">
        <tr>
            <td class="text-center"><b>實領金額</b><br>(A)+(B)-(C)</td>
            <td class="text-center net-amount">${data.netPay}</td>
        </tr>
    </table>

    ${(data.showLeave || data.showComp) ? `
<p class="note">＊備註：貴事業單位如有實施特別休假遞延或加班補休制度，請參考下列表格使用：</p>

<table class="small-table">
    <tr>
        <th colspan="2">特別休假</th>
        <th colspan="2">加班補休</th>
    </tr>
    <tr>
        <td>請休期間：${data.showLeave ? data.leavePeriod : ''}</td>
        <td></td>
        <td colspan="2">勞雇雙方約定之補休期限：${data.showComp ? data.compDeadline : ''}</td>
    </tr>
    <tr>
        <td>經過遞延的特別休假日數</td>
        <td class="text-center">${data.showLeave ? `${data.deferredLeaveDays}日` : ''}</td>
        <td>至上月止未休補休時數（Ⅰ）</td>
        <td class="text-center">${data.showComp ? `${data.prevMonthComp}小時` : ''}</td>
    </tr>
    <tr>
        <td>今年可休的特別休假日數</td>
        <td class="text-center">${data.showLeave ? `${data.annualLeaveDays}日` : ''}</td>
        <td>本月選擇補休時數（Ⅱ）</td>
        <td class="text-center">${data.showComp ? `${data.thisMonthCompChoice}小時` : ''}</td>
    </tr>
    <tr>
        <td>今年已休的特別休假日數</td>
        <td class="text-center">${data.showLeave ? `${data.usedLeaveDays}日` : ''}</td>
        <td>本月已補休時數（Ⅲ）</td>
        <td class="text-center">${data.showComp ? `${data.thisMonthCompUsed}小時` : ''}</td>
    </tr>
    <tr>
        <td>今年未休的特別休假日數</td>
        <td class="text-center">${data.showLeave ? `${data.remainingLeaveDays}日` : ''}</td>
        <td>届期未休補折發工資時數（Ⅳ）</td>
        <td class="text-center">${data.showComp ? `${data.expiredCompHours}小時` : ''}</td>
    </tr>
    <tr>
        <td>今年特別休假的請休期日</td>
        <td class="text-center">${data.showLeave ? data.leaveDeadline : ''}</td>
        <td>至本月止未休補休時數（Ⅰ）+（Ⅱ）-（Ⅲ）-（Ⅳ）</td>
        <td class="text-center">${data.showComp ? `${data.remainingCompHours}小時` : ''}</td>
    </tr>
</table>
` : ''}
</div>
</body>
</html>`;
}

function showPreview() {
    const data = getFormData();
    const htmlContent = getPDFHtml(data);
    
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'width: 100%; height: 100%; border: none; background: white;';
    
    pdfContent.innerHTML = '';
    pdfContent.appendChild(iframe);
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();
    
    previewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePreview() {
    previewModal.classList.remove('active');
    document.body.style.overflow = '';
}

// 主要匯出函數 - 使用新視窗列印
function exportPDF() {
    const data = getFormData();
    const htmlContent = getPDFHtml(data);
    
    // 開啟新視窗
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!printWindow) {
        alert('請允許彈出視窗以匯出 PDF');
        return;
    }
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // 等待內容載入後自動列印
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
        }, 250);
    };
}

function clearForm() {
    if (confirm('確定要清除所有資料嗎？')) {
        Object.values(form).forEach(input => {
            if (input && input.tagName === 'INPUT') {
                input.value = '';
            }
        });
        localStorage.removeItem('salarySlipData');
        updateCalculations();
    }
}

// ===== Event Listeners =====
const moneyInputs = document.querySelectorAll('.money-input');
moneyInputs.forEach(input => {
    input.addEventListener('input', updateCalculations);
});

const compInputs = [form.prevMonthComp, form.thisMonthCompChoice, form.thisMonthCompUsed, form.expiredCompHours];
compInputs.forEach(input => {
    if (input) {
        input.addEventListener('input', updateCalculations);
    }
});

// 職位切換：正職 / 計時
form.position?.addEventListener('change', () => {
    updateEmploymentUI();
    saveToLocalStorage();
});

// 計時即時計算（分鐘 + 時薪）
[form.parttimeMinutes, form.parttimeWage].forEach(el => {
    if (!el) return;
    el.addEventListener('input', () => {
        updateParttimeTotal();
        updateCalculations();
        saveToLocalStorage();
    });
});

previewBtn.addEventListener('click', showPreview);
exportBtn.addEventListener('click', exportPDF);
clearBtn.addEventListener('click', clearForm);
closeModal.addEventListener('click', closePreview);
modalExportBtn.addEventListener('click', () => {
    closePreview();
    exportPDF();
});

previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
        closePreview();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && previewModal.classList.contains('active')) {
        closePreview();
    }
});

// ===== Mode Switching =====
const switchModeBtn = document.getElementById('switchModeBtn');
const salarySection = document.getElementById('salarySection');
const scheduleSection = document.getElementById('scheduleSection');
let currentMode = 'salary'; // 'salary' or 'schedule'

function switchMode() {
    if (currentMode === 'salary') {
        // 切換到排班表
        salarySection.classList.remove('active');
        scheduleSection.classList.add('active');
        switchModeBtn.querySelector('.switch-text').textContent = '切換至薪資發放明細表產生器';
        switchModeBtn.querySelector('.switch-icon').textContent = '📄';
        currentMode = 'schedule';
    } else {
        // 切換到薪資表
        scheduleSection.classList.remove('active');
        salarySection.classList.add('active');
        switchModeBtn.querySelector('.switch-text').textContent = '切換至周排班表產生器';
        switchModeBtn.querySelector('.switch-icon').textContent = '📅';
        currentMode = 'salary';
    }
}

if (switchModeBtn) {
    switchModeBtn.addEventListener('click', switchMode);
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    form.payDate.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    form.year.value = today.getFullYear() - 1911;
    form.month.value = today.getMonth() + 1;
    updateCalculations();
    loadFromLocalStorage();
    // ===== Feature Flags: UI Hide/Show =====
    const leaveFormSection = document.getElementById('leaveFormSection');
    if (leaveFormSection) leaveFormSection.style.display = ENABLE_LEAVE_SECTION ? '' : 'none';

    const compFormSection = document.getElementById('compFormSection');
    if (compFormSection) compFormSection.style.display = ENABLE_COMP_SECTION ? '' : 'none';

// ===== UI Toggle Logic =====
const toggleLeave = document.getElementById('toggleLeave');
const toggleComp  = document.getElementById('toggleComp');

const leaveSection = document.getElementById('leaveFormSection');
const compSection  = document.getElementById('compFormSection');

function updateSectionVisibility() {
    const showLeave = ENABLE_LEAVE_SECTION && toggleLeave?.checked;
    const showComp  = ENABLE_COMP_SECTION  && toggleComp?.checked;

    if (leaveSection) leaveSection.style.display = showLeave ? '' : 'none';
    if (compSection)  compSection.style.display  = showComp  ? '' : 'none';
}

        // 初始化 checkbox 狀態
        if (toggleLeave) toggleLeave.checked = ENABLE_LEAVE_SECTION;
        if (toggleComp)  toggleComp.checked  = ENABLE_COMP_SECTION;

        updateSectionVisibility();

        // 監聽 UI 開關
        toggleLeave?.addEventListener('change', updateSectionVisibility);
        toggleComp?.addEventListener('change', updateSectionVisibility);

    });

// ===== Local Storage =====
function saveToLocalStorage() {
    const data = {};
    Object.entries(form).forEach(([key, input]) => {
        if (input && input.value) {
            data[key] = input.value;
        }
    });
    localStorage.setItem('salarySlipData', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('salarySlipData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            Object.entries(data).forEach(([key, value]) => {
                if (form[key]) {
                    form[key].value = value;
                }
            });
            updateCalculations();
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', saveToLocalStorage);
});
// ===== UI Toggle Logic (放在檔案最底端，確保DOM都生成了) =====
(function initSectionToggles() {
    const toggleLeave = document.getElementById('toggleLeave');
    const toggleComp  = document.getElementById('toggleComp');

    const leaveSection = document.getElementById('leaveFormSection');
    const compSection  = document.getElementById('compFormSection');

    // 先印出來確認有抓到
    console.log('[toggle] elements:', { toggleLeave, toggleComp, leaveSection, compSection });

    if (!toggleLeave || !toggleComp || !leaveSection || !compSection) {
        console.warn('[toggle] 缺少元素，請檢查 id 是否一致');
        return;
    }

    function updateSectionVisibility() {
        // 工程開關（如果你沒有這兩個常數，就先當成 true）
        const enableLeave = (typeof ENABLE_LEAVE_SECTION === 'undefined') ? true : ENABLE_LEAVE_SECTION;
        const enableComp  = (typeof ENABLE_COMP_SECTION  === 'undefined') ? true : ENABLE_COMP_SECTION;

        const showLeave = enableLeave && toggleLeave.checked;
        const showComp  = enableComp  && toggleComp.checked;

        leaveSection.style.display = showLeave ? '' : 'none';
        compSection.style.display  = showComp  ? '' : 'none';

        console.log('[toggle] updated:', { showLeave, showComp, enableLeave, enableComp });
    }

    // 初始化：預設先顯示 checkbox 勾選狀態（你現在是勾選的）
    // 若工程開關是 false，也會被鎖住
    updateSectionVisibility();

    toggleLeave.addEventListener('change', updateSectionVisibility);
    toggleComp.addEventListener('change', updateSectionVisibility);
})();