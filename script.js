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

function createPDFTemplate(data) {
    const template = document.createElement('div');
    template.className = 'pdf-template';
    template.style.cssText = `
        display: block;
        background: white;
        color: #1a1a1a;
        padding: 30px;
        font-family: 'Noto Sans TC', sans-serif;
        font-size: 12px;
        line-height: 1.5;
        width: 210mm;
    `;
    
    template.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 20px; font-weight: 700; color: #1a1a1a; margin: 0;">
                ${data.year}年${data.month}月薪資發放明細表
            </h1>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
            <tr>
                <td style="padding: 8px 10px; border: 1px solid #333; background: #f5f5f5; font-size: 12px;"><strong>姓名</strong></td>
                <td style="padding: 8px 10px; border: 1px solid #333; font-size: 12px;">${data.name}</td>
                <td style="padding: 8px 10px; border: 1px solid #333; background: #f5f5f5; font-size: 12px;"><strong>職位</strong></td>
                <td style="padding: 8px 10px; border: 1px solid #333; font-size: 12px;">${data.position}</td>
                <td style="padding: 8px 10px; border: 1px solid #333; background: #f5f5f5; font-size: 12px;"><strong>入帳帳號</strong></td>
                <td style="padding: 8px 10px; border: 1px solid #333; font-size: 12px;">${data.account}</td>
                <td style="padding: 8px 10px; border: 1px solid #333; background: #f5f5f5; font-size: 12px;"><strong>發薪日期</strong></td>
                <td style="padding: 8px 10px; border: 1px solid #333; font-size: 12px;">${data.payDate}</td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
            <thead>
                <tr>
                    <th colspan="2" style="border: 1px solid #333; padding: 8px 10px; background: #e5e5e5; font-weight: 600; text-align: center;">約定薪資結構</th>
                    <th colspan="2" style="border: 1px solid #333; padding: 8px 10px; background: #e5e5e5; font-weight: 600; text-align: center;"></th>
                    <th colspan="2" style="border: 1px solid #333; padding: 8px 10px; background: #e5e5e5; font-weight: 600; text-align: center;">應代扣項目</th>
                </tr>
                <tr>
                    <th style="border: 1px solid #333; padding: 8px 10px; background: #e5e5e5; font-weight: 600; text-align: center;">項目</th>
                    <th style="border: 1px solid #333; padding: 8px 10px; background: #e5e5e5; font-weight: 600; text-align: center;">金額</th>
                    <th style="border: 1px solid #333; padding: 8px 10px; background: #e5e5e5; font-weight: 600; text-align: center;">項目</th>
                    <th style="border: 1px solid #333; padding: 8px 10px; background: #e5e5e5; font-weight: 600; text-align: center;">金額</th>
                    <th style="border: 1px solid #333; padding: 8px 10px; background: #e5e5e5; font-weight: 600; text-align: center;">項目</th>
                    <th style="border: 1px solid #333; padding: 8px 10px; background: #e5e5e5; font-weight: 600; text-align: center;">金額</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">底薪</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right; min-width: 80px;">${data.baseSalary}</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">平日加班費</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right; min-width: 80px;">${data.weekdayOT}</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">勞保費</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right; min-width: 80px;">${data.laborInsurance}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">伙食津貼</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right;">${data.mealAllowance}</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">休假日加班費</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right;">${data.holidayOT}</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">健保費</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right;">${data.healthInsurance}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">全勤獎金</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right;">${data.attendanceBonus}</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">休息日加班費</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right;">${data.restDayOT}</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">職工福利金</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right;">${data.welfareFund}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">職務津貼</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right;">${data.positionAllowance}</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">未休特別休假工資</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right;">${data.unusedLeaveWage}</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">勞工自願提繳退休金</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right;">${data.voluntaryPension}</td>
                </tr>
                <tr>
                    <td rowspan="2" style="border: 1px solid #333; padding: 8px 10px; text-align: center; background: #f9f9f9; writing-mode: vertical-rl;">非固定支付項目</td>
                    <td rowspan="2" style="border: 1px solid #333; padding: 8px 10px;"></td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">届期未補休折發工資</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right;">${data.expiredCompWage}</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">事假</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right;">${data.personalLeave}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #333; padding: 8px 10px;"></td>
                    <td style="border: 1px solid #333; padding: 8px 10px;"></td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">病假</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right;">${data.sickLeave}</td>
                </tr>
                <tr style="background: #f0f0f0; font-weight: 600;">
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">小計(A)</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right;">${data.subtotalA}</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">小計(B)</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right;">${data.subtotalB}</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">小計(C)</td>
                    <td style="border: 1px solid #333; padding: 8px 10px; text-align: right;">${data.subtotalC}</td>
                </tr>
            </tbody>
        </table>

        <table style="margin: 20px auto; max-width: 300px; border-collapse: collapse;">
            <tr>
                <td style="border: 2px solid #333; padding: 15px 20px; text-align: center;">
                    <strong>實領金額</strong><br>
                    (A)+(B)-(C)
                </td>
                <td style="border: 2px solid #333; padding: 15px 20px; text-align: center; font-size: 22px; font-weight: 700;">${data.netPay}</td>
            </tr>
        </table>

        <div style="margin-top: 20px;">
            <p style="font-size: 11px; margin-bottom: 10px;">＊備註：貴事業單位如有實施特別休假遞延或加班補休制度，請參考下列表格使用：</p>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th colspan="2" style="border: 1px solid #333; padding: 6px 8px; background: #e5e5e5; text-align: center; font-weight: 600; font-size: 11px;">特別休假</th>
                    <th colspan="2" style="border: 1px solid #333; padding: 6px 8px; background: #e5e5e5; text-align: center; font-weight: 600; font-size: 11px;">加班補休</th>
                </tr>
                <tr>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">請休期間：${data.leavePeriod}</td>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;"></td>
                    <td colspan="2" style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">勞雇雙方約定之補休期限：${data.compDeadline}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">經過遞延的特別休假日數</td>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">${data.deferredLeaveDays}日</td>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">至上月止未休補休時數（Ⅰ）</td>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">${data.prevMonthComp}小時</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">今年可休的特別休假日數</td>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">${data.annualLeaveDays}日</td>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">本月選擇補休時數（Ⅱ）</td>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">${data.thisMonthCompChoice}小時</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">今年已休的特別休假日數</td>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">${data.usedLeaveDays}日</td>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">本月已補休時數（Ⅲ）</td>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">${data.thisMonthCompUsed}小時</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">今年未休的特別休假日數</td>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">${data.remainingLeaveDays}日</td>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">届期未休補折發工資時數（Ⅳ）</td>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">${data.expiredCompHours}小時</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">今年特別休假的請休期日</td>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">${data.leaveDeadline}</td>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">至本月止未休補休時數<br>（Ⅰ）+（Ⅱ）-（Ⅲ）-（Ⅳ）</td>
                    <td style="border: 1px solid #333; padding: 6px 8px; font-size: 11px;">${data.remainingCompHours}小時</td>
                </tr>
            </table>
        </div>
    `;
    
    return template;
}

function showPreview() {
    const data = getFormData();
    const template = createPDFTemplate(data);
    pdfContent.innerHTML = '';
    pdfContent.appendChild(template);
    previewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePreview() {
    previewModal.classList.remove('active');
    document.body.style.overflow = '';
}

async function exportPDF() {
    const data = getFormData();
    const template = createPDFTemplate(data);
    
    // Create a container for rendering
    const container = document.createElement('div');
    container.className = 'pdf-render-container';
    container.style.cssText = 'position: fixed; left: 0; top: 0; z-index: 9999; background: white;';
    container.appendChild(template);
    document.body.appendChild(container);
    
    // Wait for fonts to load
    await document.fonts.ready;
    
    // Small delay to ensure rendering
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // PDF options
    const opt = {
        margin: [10, 10, 10, 10],
        filename: `薪資明細表_${data.year}年${data.month}月_${data.name || '姓名'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: false,
            letterRendering: true,
            allowTaint: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        }
    };
    
    try {
        // Generate PDF
        await html2pdf().set(opt).from(template).save();
    } catch (error) {
        console.error('PDF generation error:', error);
        alert('PDF 生成失敗，請稍後再試');
    } finally {
        // Clean up
        document.body.removeChild(container);
    }
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
// Add input listeners for auto-calculation
const moneyInputs = document.querySelectorAll('.money-input');
moneyInputs.forEach(input => {
    input.addEventListener('input', updateCalculations);
});

// Comp time calculation
const compInputs = [form.prevMonthComp, form.thisMonthCompChoice, form.thisMonthCompUsed, form.expiredCompHours];
compInputs.forEach(input => {
    if (input) {
        input.addEventListener('input', updateCalculations);
    }
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
    
    // Load saved data
    loadFromLocalStorage();
});

// ===== Local Storage (Save Form Data) =====
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

// Auto-save on input
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', saveToLocalStorage);
});
