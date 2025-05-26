# PPTX Compressor

一个基于浏览器的 PPTX 文件压缩工具，通过优化嵌入图片来减小文件大小。

## 功能特点

- 自动压缩 PPTX 文件中的图片
- 保持视觉质量的同时实现最大压缩率
- 使用 Web Workers 进行高效压缩
- 支持拖放上传
- 实时压缩进度显示

## 安装和运行

### 方法 1：使用 Node.js（推荐）

1. 确保已安装 [Node.js](https://nodejs.org/)
2. 克隆此仓库
3. 在项目目录中运行：
   ```bash
   npm install
   npm start
   ```
4. 在浏览器中访问 `http://localhost:8080`

### 方法 2：使用 Python

1. 确保已安装 Python
2. 在项目目录中运行：
   ```bash
   # Python 3
   python -m http.server 8080
   
   # Python 2
   python -m SimpleHTTPServer 8080
   ```
3. 在浏览器中访问 `http://localhost:8080`

## 使用说明

1. 打开网页后，将 PPTX 文件拖放到指定区域，或点击选择文件
2. 等待压缩完成
3. 查看压缩结果和统计信息
4. 点击下载按钮保存压缩后的文件

## 技术说明

- 使用 ES6+ 模块系统
- 使用 Web Workers 进行图片压缩
- 使用 JSZip 处理 PPTX 文件
- 纯前端实现，无需后端服务器

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Edge 80+
- Safari 13.1+

## 注意事项

- 建议使用现代浏览器以获得最佳性能
- 大文件处理可能需要较长时间
- 请确保有足够的内存处理大文件 