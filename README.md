# 📄 薪資發放明細表產生器

一個簡易的網頁應用程式，可以在線上填寫薪資資料，並匯出符合台灣勞動法規格式的 PDF 薪資單。

![Demo](https://img.shields.io/badge/Demo-GitHub%20Pages-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ 功能特色

- 📝 完整的薪資欄位輸入（約定薪資、加班費、應扣項目）
- 🔢 自動計算小計與實領金額
- 🏖️ 特別休假與加班補休記錄
- 👁️ PDF 預覽功能
- 📥 一鍵匯出 PDF 檔案
- 💾 自動儲存表單資料（使用 LocalStorage）
- 📱 響應式設計，支援手機與平板
- 🌙 現代化深色主題介面

## 🚀 快速開始

### 線上使用

直接訪問 GitHub Pages：
```
https://[你的用戶名].github.io/[repository名稱]/
```

### 本地運行

1. 下載或克隆此專案：
```bash
git clone https://github.com/[你的用戶名]/[repository名稱].git
```

2. 直接用瀏覽器開啟 `index.html` 即可使用

## 📦 部署到 GitHub Pages

### 方法一：透過 GitHub 網頁介面

1. 在 GitHub 上建立一個新的 repository
2. 上傳所有檔案（`index.html`, `style.css`, `script.js`）
3. 進入 repository 的 **Settings** > **Pages**
4. 在 **Source** 選擇 `Deploy from a branch`
5. 選擇 `main` 分支，資料夾選擇 `/ (root)`
6. 點擊 **Save**
7. 等待幾分鐘後，你的網站就會在 `https://[用戶名].github.io/[repo名稱]/` 上線

### 方法二：使用 Git 命令列

```bash
# 初始化 Git repository
git init

# 添加所有檔案
git add .

# 提交
git commit -m "Initial commit: 薪資發放明細表產生器"

# 添加遠端 repository
git remote add origin https://github.com/[你的用戶名]/[repository名稱].git

# 推送到 GitHub
git push -u origin main
```

然後按照方法一的步驟 3-7 在 GitHub 上啟用 Pages。

## 📁 專案結構

```
web-pdf/
├── index.html      # 主頁面
├── style.css       # 樣式表
├── script.js       # JavaScript 邏輯
└── README.md       # 說明文件
```

## 🛠️ 技術棧

- **HTML5** - 頁面結構
- **CSS3** - 樣式設計（CSS Variables、Flexbox、Grid）
- **JavaScript (ES6+)** - 互動邏輯
- **html2pdf.js** - PDF 生成（CDN 引入）
- **Google Fonts** - Noto Sans TC 字體

## 📋 表單欄位說明

### 基本資訊
| 欄位 | 說明 |
|------|------|
| 年份 | 民國年（例：113） |
| 月份 | 1-12 月 |
| 姓名 | 員工姓名 |
| 職位 | 職稱 |
| 入帳帳號 | 銀行帳號 |
| 發薪日期 | 薪資發放日期 |

### 約定薪資結構 (A)
- 底薪
- 伙食津貼
- 全勤獎金
- 職務津貼

### 加班費 / 其他 (B)
- 平日加班費
- 休假日加班費
- 休息日加班費
- 未休特別休假工資
- 届期未補休折發工資

### 應代扣項目 (C)
- 勞保費
- 健保費
- 職工福利金
- 勞工自願提繳退休金
- 事假扣款
- 病假扣款

### 實領金額計算
```
實領金額 = (A) + (B) - (C)
```

## 🔧 自訂修改

### 修改樣式
編輯 `style.css` 中的 CSS Variables：

```css
:root {
    --primary: #2563eb;      /* 主色調 */
    --bg-main: #0f172a;      /* 背景色 */
    --text-primary: #f1f5f9; /* 文字顏色 */
    /* ... */
}
```

### 新增欄位
1. 在 `index.html` 中新增 input 元素
2. 在 `script.js` 的 `form` 物件中添加對應的 DOM 元素
3. 更新計算函數與 PDF 模板

## 📄 授權

本專案採用 MIT 授權條款，詳見 [LICENSE](LICENSE) 文件。

## 🙏 致謝

- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) - PDF 生成函式庫
- [Google Fonts](https://fonts.google.com/) - Noto Sans TC 字體
- 參考台灣勞動部薪資明細表範例格式

---

如有任何問題或建議，歡迎提出 Issue 或 Pull Request！

