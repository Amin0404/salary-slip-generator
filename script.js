// ===== DOM Elements =====
const form = {
    // Basic Info
    year: document.getElementById('year'),
    month: document.getElementById('month'),
    name: document.getElementById('name'),
    position: document.getElementById('position'),
    account: document.getElementById('account'),
    payDate: document.getElementById('payDate'),
    
    // Salary Structure (A)
    baseSalary: document.getElementById('baseSalary'),
    mealAllowance: document.getElementById('mealAllowance'),
    attendanceBonus: document.getElementById('attendanceBonus'),
    positionAllowance: document.getElementById('positionAllowance'),
    teaBonus: document.getElementById('teaBonus'),
    
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

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear() - 1911;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}

// ===== Calculation Functions =====
function calculateSubtotalA() {
    return getNumber(form.baseSalary) +
           getNumber(form.mealAllowance) +
           getNumber(form.attendanceBonus) +
           getNumber(form.positionAllowance) +
           getNumber(form.teaBonus);
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
    return calculateSubtotalA() + calculateSubtotalB() - calculateSubtotalC();
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
        account: form.account.value || '',
        payDate: formatDate(form.payDate.value),
        
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
            <td class="bg-light text-center" style="width:10%"><b>入帳帳號</b></td>
            <td style="width:20%">${data.account}</td>
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
                <td class="text-center">底薪</td>
                <td class="text-right">${data.baseSalary}</td>
                <td class="text-center">平日加班費</td>
                <td class="text-right">${data.weekdayOT}</td>
                <td class="text-center">勞保費</td>
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

    <p class="note">＊備註：貴事業單位如有實施特別休假遞延或加班補休制度，請參考下列表格使用：</p>
    
    <table class="small-table">
        <tr>
            <th colspan="2">特別休假</th>
            <th colspan="2">加班補休</th>
        </tr>
        <tr>
            <td>請休期間：${data.leavePeriod}</td>
            <td></td>
            <td colspan="2">勞雇雙方約定之補休期限：${data.compDeadline}</td>
        </tr>
        <tr>
            <td>經過遞延的特別休假日數</td>
            <td class="text-center">${data.deferredLeaveDays}日</td>
            <td>至上月止未休補休時數（Ⅰ）</td>
            <td class="text-center">${data.prevMonthComp}小時</td>
        </tr>
        <tr>
            <td>今年可休的特別休假日數</td>
            <td class="text-center">${data.annualLeaveDays}日</td>
            <td>本月選擇補休時數（Ⅱ）</td>
            <td class="text-center">${data.thisMonthCompChoice}小時</td>
        </tr>
        <tr>
            <td>今年已休的特別休假日數</td>
            <td class="text-center">${data.usedLeaveDays}日</td>
            <td>本月已補休時數（Ⅲ）</td>
            <td class="text-center">${data.thisMonthCompUsed}小時</td>
        </tr>
        <tr>
            <td>今年未休的特別休假日數</td>
            <td class="text-center">${data.remainingLeaveDays}日</td>
            <td>届期未休補折發工資時數（Ⅳ）</td>
            <td class="text-center">${data.expiredCompHours}小時</td>
        </tr>
        <tr>
            <td>今年特別休假的請休期日</td>
            <td class="text-center">${data.leaveDeadline}</td>
            <td>至本月止未休補休時數（Ⅰ）+（Ⅱ）-（Ⅲ）-（Ⅳ）</td>
            <td class="text-center">${data.remainingCompHours}小時</td>
        </tr>
    </table>
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

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    form.payDate.value = today.toISOString().split('T')[0];
    form.year.value = today.getFullYear() - 1911;
    form.month.value = today.getMonth() + 1;
    updateCalculations();
    loadFromLocalStorage();
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
