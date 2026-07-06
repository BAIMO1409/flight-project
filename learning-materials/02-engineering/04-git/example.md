# Git 示例操作指南

## 一、基础操作流程

### 1. 初始化仓库
```bash
# 创建项目目录
mkdir flight-project
cd flight-project

# 初始化Git仓库
git init

# 创建基础文件
echo "# Flight Project" > README.md
touch .gitignore
```

### 2. 配置用户信息
```bash
# 全局配置
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 当前仓库配置（可选）
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 3. 第一次提交
```bash
# 添加文件到暂存区
git add README.md .gitignore

# 提交更改
git commit -m "init: 初始化项目"

# 查看提交记录
git log
```

## 二、分支管理

### 1. 创建分支
```bash
# 查看当前分支
git branch

# 创建develop分支
git branch develop

# 创建并切换到feature分支
git checkout -b feature/login
```

### 2. 分支切换
```bash
# 切换到develop分支
git checkout develop

# 切换到main分支
git checkout main
```

### 3. 分支合并
```bash
# 在develop分支合并feature/login
git checkout develop
git merge feature/login

# 删除已合并的feature分支
git branch -d feature/login
```

## 三、远程仓库

### 1. 关联远程仓库
```bash
# 添加远程仓库
git remote add origin https://github.com/your-username/flight-project.git

# 查看远程仓库
git remote -v
```

### 2. 推送代码
```bash
# 推送main分支
git push -u origin main

# 推送develop分支
git push -u origin develop

# 推送feature分支
git push -u origin feature/login
```

### 3. 拉取代码
```bash
# 拉取main分支最新代码
git pull origin main

# 拉取develop分支最新代码
git pull origin develop
```

## 四、工作流示例（Git Flow）

```bash
# 1. 从develop创建feature分支
git checkout develop
git checkout -b feature/flight-list

# 2. 在feature分支开发
git add .
git commit -m "feat: 实现航班列表组件"
git commit -m "feat: 添加日期选择功能"

# 3. 推送feature分支
git push -u origin feature/flight-list

# 4. 创建Pull Request（在GitHub上操作）

# 5. 审查通过后合并到develop
git checkout develop
git pull origin develop
git merge feature/flight-list

# 6. 删除feature分支
git branch -d feature/flight-list
git push origin --delete feature/flight-list
```

## 五、提交规范示例

### 格式
```
<type>(<scope>): <description>

<body>

<footer>
```

### 类型说明
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式（不影响代码逻辑）
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

### 示例
```bash
# 新功能
git commit -m "feat(flight-list): 实现航班列表展示"

# 修复bug
git commit -m "fix(date-picker): 修复日期选择器样式问题"

# 文档更新
git commit -m "docs: 更新README运行说明"

# 重构
git commit -m "refactor(store): 使用Redux替换MobX"
```

## 六、冲突解决

### 1. 场景示例
```bash
# 拉取远程代码产生冲突
git pull origin develop

# 查看冲突文件
git status

# 冲突标记示例：
<<<<<<< HEAD
const price = 500;
=======
const price = 480;
>>>>>>> origin/develop
```

### 2. 解决步骤
```bash
# 1. 手动编辑冲突文件，保留正确代码

# 2. 添加解决后的文件
git add conflict-file.js

# 3. 提交解决
git commit -m "fix: 解决价格计算冲突"
```

## 七、实用技巧

### 1. 查看差异
```bash
# 查看工作区与暂存区差异
git diff

# 查看暂存区与最后一次提交差异
git diff --cached

# 查看两个分支差异
git diff feature/login...develop
```

### 2. 撤销操作
```bash
# 撤销工作区修改（未add）
git checkout -- file.js

# 撤销暂存区修改（已add）
git reset HEAD file.js

# 回退到上一次提交（保留工作区）
git reset --soft HEAD~1

# 回退到上一次提交（丢弃工作区）
git reset --hard HEAD~1
```

### 3. 暂存工作区
```bash
# 暂存当前工作区
git stash

# 查看暂存列表
git stash list

# 恢复暂存
git stash pop

# 删除暂存
git stash drop
```

### 4. 标签管理
```bash
# 创建标签
git tag v1.0.0

# 推送标签
git push origin v1.0.0

# 查看标签
git tag
```

## 八、.gitignore 示例

```
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment variables
.env
.env.local

# Logs
*.log

# Editor
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
```
