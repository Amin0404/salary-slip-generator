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
const pdfTemplate = document.getElementById('pdfTemplate');

// ===== Utility Functions =====
function getNumber(element) {
    return parseFloat(element.value) || 0;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: 'TWD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear() - 1911; // Convert to ROC year
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}

// ===== Calculation Functions =====
function calculateSubtotalA() {
    const total = getNumber(form.baseSalary) +
                  getNumber(form.mealAllowance) +
                  getNumber(form.attendanceBonus) +
                  getNumber(form.positionAllowance);
    return total;
}

function calculateSubtotalB() {
    const total = getNumber(form.weekdayOT) +
                  getNumber(form.holidayOT) +
                  getNumber(form.restDayOT) +
                  getNumber(form.unusedLeaveWage) +
                  getNumber(form.expiredCompWage);
    return total;
}

function calculateSubtotalC() {
    const total = getNumber(form.laborInsurance) +
                  getNumber(form.healthInsurance) +
                  getNumber(form.welfareFund) +
                  getNumber(form.voluntaryPension) +
                  getNumber(form.personalLeave) +
                  getNumber(form.sickLeave);
    return total;
}

function calculateNetPay() {
    return calculateSubtotalA() + calculateSubtotalB() - calculateSubtotalC();
}

function calculateRemainingComp() {
    const result = getNumber(form.prevMonthComp) +
                   getNumber(form.thisMonthCompChoice) -
                   getNumber(form.thisMonthCompUsed) -
                   getNumber(form.expiredCompHours);
    return result;
}

function updateCalculations() {
    const a = calculateSubtotalA();
    const b = calculateSubtotalB();
    const c = calculateSubtotalC();
    const net = calculateNetPay();
    const remainingComp = calculateRemainingComp();
    
    subtotalA.textContent = formatCurrency(a);
    subtotalB.textContent = formatCurrency(b);
    subtotalC.textContent = formatCurrency(c);
    netPay.textContent = formatCurrency(net);
    form.remainingCompHours.value = remainingComp;
}

// ===== PDF Generation =====
function populatePDFTemplate() {
    // Clone the template
    const template = pdfTemplate.cloneNode(true);
    template.style.display = 'block';
    template.classList.add('pdf-template');
    
    // Basic Info
    template.querySelector('#pdfYear').textContent = form.year.value || '○';
    template.querySelector('#pdfMonth').textContent = form.month.value || '○';
    template.querySelector('#pdfName').textContent = form.name.value || '';
    template.querySelector('#pdfPosition').textContent = form.position.value || '';
    template.querySelector('#pdfAccount').textContent = form.account.value || '';
    template.querySelector('#pdfPayDate').textContent = formatDate(form.payDate.value);
    
    // Salary Structure (A)
    template.querySelector('#pdfBaseSalary').textContent = formatCurrency(getNumber(form.baseSalary));
    template.querySelector('#pdfMealAllowance').textContent = formatCurrency(getNumber(form.mealAllowance));
    template.querySelector('#pdfAttendanceBonus').textContent = formatCurrency(getNumber(form.attendanceBonus));
    template.querySelector('#pdfPositionAllowance').textContent = formatCurrency(getNumber(form.positionAllowance));
    
    // Overtime (B)
    template.querySelector('#pdfWeekdayOT').textContent = formatCurrency(getNumber(form.weekdayOT));
    template.querySelector('#pdfHolidayOT').textContent = formatCurrency(getNumber(form.holidayOT));
    template.querySelector('#pdfRestDayOT').textContent = formatCurrency(getNumber(form.restDayOT));
    template.querySelector('#pdfUnusedLeave').textContent = formatCurrency(getNumber(form.unusedLeaveWage));
    template.querySelector('#pdfExpiredComp').textContent = formatCurrency(getNumber(form.expiredCompWage));
    
    // Deductions (C)
    template.querySelector('#pdfLaborIns').textContent = formatCurrency(getNumber(form.laborInsurance));
    template.querySelector('#pdfHealthIns').textContent = formatCurrency(getNumber(form.healthInsurance));
    template.querySelector('#pdfWelfare').textContent = formatCurrency(getNumber(form.welfareFund));
    template.querySelector('#pdfVolPension').textContent = formatCurrency(getNumber(form.voluntaryPension));
    template.querySelector('#pdfPersonalLeave').textContent = formatCurrency(getNumber(form.personalLeave));
    template.querySelector('#pdfSickLeave').textContent = formatCurrency(getNumber(form.sickLeave));
    
    // Subtotals
    template.querySelector('#pdfSubtotalA').textContent = formatCurrency(calculateSubtotalA());
    template.querySelector('#pdfSubtotalB').textContent = formatCurrency(calculateSubtotalB());
    template.querySelector('#pdfSubtotalC').textContent = formatCurrency(calculateSubtotalC());
    template.querySelector('#pdfNetPay').textContent = formatCurrency(calculateNetPay());
    
    // Leave Info
    const leavePeriod = form.leaveStartDate.value && form.leaveEndDate.value 
        ? `${formatDate(form.leaveStartDate.value)}－${formatDate(form.leaveEndDate.value)}`
        : '';
    template.querySelector('#pdfLeavePeriod').textContent = leavePeriod;
    template.querySelector('#pdfDeferredDays').textContent = form.deferredLeaveDays.value || '○';
    template.querySelector('#pdfAnnualDays').textContent = form.annualLeaveDays.value || '○';
    template.querySelector('#pdfUsedDays').textContent = form.usedLeaveDays.value || '○';
    template.querySelector('#pdfRemainingDays').textContent = form.remainingLeaveDays.value || '○';
    template.querySelector('#pdfLeaveDeadline').textContent = form.leaveDeadline.value || '';
    
    // Comp Time Info
    template.querySelector('#pdfCompDeadline').textContent = form.compDeadline.value || '';
    template.querySelector('#pdfPrevComp').textContent = form.prevMonthComp.value || '○';
    template.querySelector('#pdfThisChoice').textContent = form.thisMonthCompChoice.value || '○';
    template.querySelector('#pdfThisUsed').textContent = form.thisMonthCompUsed.value || '○';
    template.querySelector('#pdfExpiredHours').textContent = form.expiredCompHours.value || '○';
    template.querySelector('#pdfRemainingComp').textContent = calculateRemainingComp() || '○';
    
    return template;
}

function showPreview() {
    const template = populatePDFTemplate();
    pdfContent.innerHTML = '';
    pdfContent.appendChild(template);
    previewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePreview() {
    previewModal.classList.remove('active');
    document.body.style.overflow = '';
}

function exportPDF() {
    const template = populatePDFTemplate();
    
    // Create a temporary container
    const container = document.createElement('div');
    container.appendChild(template);
    document.body.appendChild(container);
    
    // PDF options
    const opt = {
        margin: [10, 10, 10, 10],
        filename: `薪資明細表_${form.year.value || '○'}年${form.month.value || '○'}月_${form.name.value || '姓名'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        }
    };
    
    // Generate PDF
    html2pdf().set(opt).from(template).save().then(() => {
        document.body.removeChild(container);
    });
}

function clearForm() {
    if (confirm('確定要清除所有資料嗎？')) {
        Object.values(form).forEach(input => {
            if (input && input.tagName === 'INPUT') {
                input.value = '';
            }
        });
        updateCalculations();
    }
}

// ===== Event Listeners =====
// Add input listeners for auto-calculation
const moneyInputs = document.querySelectorAll('.money-input');
moneyInputs.forEach(input => {
    input.addEventListener('input', updateCalculations);
});

// Comp time calculation
const compInputs = [form.prevMonthComp, form.thisMonthCompChoice, form.thisMonthCompUsed, form.expiredCompHours];
compInputs.forEach(input => {
    input.addEventListener('input', updateCalculations);
});

// Button listeners
previewBtn.addEventListener('click', showPreview);
exportBtn.addEventListener('click', exportPDF);
clearBtn.addEventListener('click', clearForm);
closeModal.addEventListener('click', closePreview);
modalExportBtn.addEventListener('click', () => {
    closePreview();
    exportPDF();
});

// Close modal on outside click
previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
        closePreview();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && previewModal.classList.contains('active')) {
        closePreview();
    }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Set default date to today
    const today = new Date();
    form.payDate.value = today.toISOString().split('T')[0];
    
    // Set default year and month (ROC calendar)
    form.year.value = today.getFullYear() - 1911;
    form.month.value = today.getMonth() + 1;
    
    // Initialize calculations
    updateCalculations();
});

// ===== Local Storage (Optional - Save Form Data) =====
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
        const data = JSON.parse(saved);
        Object.entries(data).forEach(([key, value]) => {
            if (form[key]) {
                form[key].value = value;
            }
        });
        updateCalculations();
    }
}

// Auto-save on input
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', saveToLocalStorage);
});

// Load saved data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
});

