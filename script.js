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
    return '$' + amount.toLocaleString('zh-TW');
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

function getPDFHtml(data) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: "Microsoft JhengHei", "微軟正黑體", "Noto Sans TC", sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
            background: #fff;
            padding: 20px;
        }
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
            padding: 6px 8px; 
            font-size: 11px;
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
            max-width: 280px; 
            margin: 15px auto; 
        }
        .total-box td { 
            padding: 12px 15px; 
            border: 2px solid #000; 
        }
        .net-amount { 
            font-size: 18px; 
            font-weight: bold; 
        }
        .note { 
            font-size: 10px; 
            margin-bottom: 8px; 
        }
        .vertical-text {
            writing-mode: vertical-rl;
            text-orientation: mixed;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="title">${data.year}年${data.month}月薪資發放明細表</div>
    
    <table>
        <tr>
            <td class="bg-light" style="width:10%"><strong>姓名</strong></td>
            <td style="width:15%">${data.name}</td>
            <td class="bg-light" style="width:10%"><strong>職位</strong></td>
            <td style="width:15%">${data.position}</td>
            <td class="bg-light" style="width:10%"><strong>入帳帳號</strong></td>
            <td style="width:20%">${data.account}</td>
            <td class="bg-light" style="width:10%"><strong>發薪日期</strong></td>
            <td style="width:10%">${data.payDate}</td>
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
                <th>項目</th>
                <th>金額</th>
                <th>項目</th>
                <th>金額</th>
                <th>項目</th>
                <th>金額</th>
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
                <td class="text-center">伙食津貼</td>
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
                <td rowspan="2" class="text-center bg-light vertical-text">非固定支付項目</td>
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
                <td class="text-center"><strong>小計(A)</strong></td>
                <td class="text-right"><strong>${data.subtotalA}</strong></td>
                <td class="text-center"><strong>小計(B)</strong></td>
                <td class="text-right"><strong>${data.subtotalB}</strong></td>
                <td class="text-center"><strong>小計(C)</strong></td>
                <td class="text-right"><strong>${data.subtotalC}</strong></td>
            </tr>
        </tbody>
    </table>

    <table class="total-box">
        <tr>
            <td class="text-center">
                <strong>實領金額</strong><br>(A)+(B)-(C)
            </td>
            <td class="text-center net-amount">${data.netPay}</td>
        </tr>
    </table>

    <p class="note">＊備註：貴事業單位如有實施特別休假遞延或加班補休制度，請參考下列表格使用：</p>
    
    <table>
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
            <td>至本月止未休補休時數<br>（Ⅰ）+（Ⅱ）-（Ⅲ）-（Ⅳ）</td>
            <td class="text-center">${data.remainingCompHours}小時</td>
        </tr>
    </table>
</body>
</html>`;
}

function showPreview() {
    const data = getFormData();
    const htmlContent = getPDFHtml(data);
    
    // Create iframe for preview
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'width: 100%; height: 100%; border: none; background: white;';
    
    pdfContent.innerHTML = '';
    pdfContent.appendChild(iframe);
    
    // Write content to iframe
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

async function exportPDF() {
    const data = getFormData();
    const htmlContent = getPDFHtml(data);
    
    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position: fixed; left: 0; top: 0; width: 210mm; height: 297mm; border: none; z-index: 99999; background: white;';
    document.body.appendChild(iframe);
    
    // Write content to iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();
    
    // Wait for content to render
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const filename = `薪資明細表_${data.year}年${data.month}月_${data.name || '姓名'}.pdf`;
    
    try {
        // Use html2pdf with iframe body
        const element = iframeDoc.body;
        
        const opt = {
            margin: 10,
            filename: filename,
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: true,
                backgroundColor: '#ffffff',
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            }
        };
        
        await html2pdf().set(opt).from(element).save();
        
    } catch (error) {
        console.error('PDF generation error:', error);
        
        // Fallback: use print dialog
        if (confirm('PDF 生成失敗，是否使用列印功能？')) {
            printPDF();
        }
    } finally {
        // Clean up
        document.body.removeChild(iframe);
    }
}

// Fallback print function
function printPDF() {
    const data = getFormData();
    const htmlContent = getPDFHtml(data);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
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
