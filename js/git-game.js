/**
 * Git Game - Interactive Git Learning Environment
 * This script implements an interactive Git game that helps users learn Git commands
 * and understand Git's internal workings through visual representation and hands-on practice.
 */

// Game state
const gameState = {
    currentLevel: 1,
    score: 0,
    completedLevels: [],
    workingDirectory: [],
    stagingArea: [],
    repository: [],
    branches: ['main'],
    currentBranch: 'main',
    commandHistory: [],
    initialized: false
};

// Game levels
const gameLevels = [
    {
        id: 1,
        title: "Git Başlangıç",
        instructions: "Git deposu oluşturun ve ilk dosyalarınızı ekleyin. Görevler:<br>1. <code>git init</code> komutu ile yeni bir depo oluşturun.<br>2. <code>git status</code> ile durumu kontrol edin.<br>3. <code>git add index.html</code> ile dosyayı hazırlama alanına ekleyin.",
        tasks: [
            { command: "git init", completed: false },
            { command: "git status", completed: false },
            { command: "git add index.html", completed: false }
        ],
        initialFiles: [
            { name: "index.html", status: "untracked", icon: "fa-html5" },
            { name: "style.css", status: "untracked", icon: "fa-css3-alt" }
        ],
        hint: "Git deponuzu başlatmak için 'git init' komutunu kullanın. Ardından 'git status' ile durumu kontrol edin ve 'git add' ile dosyaları hazırlama alanına ekleyin."
    },
    {
        id: 2,
        title: "Commit İşlemleri",
        instructions: "Hazırlama alanındaki değişiklikleri commit edin. Görevler:<br>1. <code>git add style.css</code> ile ikinci dosyayı hazırlama alanına ekleyin.<br>2. <code>git commit -m \"İlk commit\"</code> ile değişiklikleri kaydedin.<br>3. <code>git status</code> ile durumu kontrol edin.",
        tasks: [
            { command: "git add style.css", completed: false },
            { command: 'git commit -m "İlk commit"', completed: false },
            { command: "git status", completed: false }
        ],
        initialFiles: [
            { name: "index.html", status: "staged", icon: "fa-html5" },
            { name: "style.css", status: "untracked", icon: "fa-css3-alt" }
        ],
        hint: "Tüm dosyaları hazırlama alanına ekledikten sonra, 'git commit -m \"mesaj\"' komutu ile değişiklikleri kaydedin."
    },
    {
        id: 3,
        title: "Dallanma",
        instructions: "Yeni bir dal oluşturun ve ona geçiş yapın. Görevler:<br>1. <code>git branch ozellik</code> ile yeni bir dal oluşturun.<br>2. <code>git checkout ozellik</code> ile yeni dala geçin.<br>3. <code>script.js</code> dosyasını oluşturun ve hazırlama alanına ekleyin: <code>git add script.js</code>",
        tasks: [
            { command: "git branch ozellik", completed: false },
            { command: "git checkout ozellik", completed: false },
            { command: "git add script.js", completed: false }
        ],
        initialFiles: [
            { name: "index.html", status: "committed", icon: "fa-html5" },
            { name: "style.css", status: "committed", icon: "fa-css3-alt" },
            { name: "script.js", status: "untracked", icon: "fa-js" }
        ],
        hint: "Yeni bir dal oluşturmak için 'git branch dal-adı' komutunu kullanın. Dala geçiş yapmak için 'git checkout dal-adı' komutunu kullanın."
    },
    {
        id: 4,
        title: "Birleştirme",
        instructions: "Dalınızdaki değişiklikleri commit edin ve ana dala birleştirin. Görevler:<br>1. <code>git commit -m \"Yeni özellik eklendi\"</code> ile değişiklikleri kaydedin.<br>2. <code>git checkout main</code> ile ana dala geçin.<br>3. <code>git merge ozellik</code> ile değişiklikleri ana dala birleştirin.",
        tasks: [
            { command: 'git commit -m "Yeni özellik eklendi"', completed: false },
            { command: "git checkout main", completed: false },
            { command: "git merge ozellik", completed: false }
        ],
        initialFiles: [
            { name: "index.html", status: "committed", icon: "fa-html5" },
            { name: "style.css", status: "committed", icon: "fa-css3-alt" },
            { name: "script.js", status: "staged", icon: "fa-js" }
        ],
        hint: "Önce değişiklikleri commit edin, sonra ana dala geçin ve 'git merge dal-adı' komutu ile birleştirme yapın."
    },
    {
        id: 5,
        title: "Uzak Repolar",
        instructions: "Uzak repo ekleyin ve değişikliklerinizi gönderin. Görevler:<br>1. <code>git remote add origin https://example.com/repo.git</code> ile uzak repo ekleyin.<br>2. <code>git push -u origin main</code> ile değişiklikleri uzak repoya gönderin.<br>3. <code>git pull origin main</code> ile uzak repodan değişiklikleri çekin.",
        tasks: [
            { command: "git remote add origin https://example.com/repo.git", completed: false },
            { command: "git push -u origin main", completed: false },
            { command: "git pull origin main", completed: false }
        ],
        initialFiles: [
            { name: "index.html", status: "committed", icon: "fa-html5" },
            { name: "style.css", status: "committed", icon: "fa-css3-alt" },
            { name: "script.js", status: "committed", icon: "fa-js" },
            { name: "README.md", status: "untracked", icon: "fa-markdown" }
        ],
        hint: "Uzak repo eklemek için 'git remote add takma-ad url' komutunu kullanın. Değişiklikleri göndermek için 'git push' ve çekmek için 'git pull' komutlarını kullanın."
    }
];

// DOM Elements
let terminalInput;
let terminalOutput;
let workingFiles;
let stagedFiles;
let commitHistory;
let branchTree;
let levelList;
let levelInstructions;
let scoreDisplay;
let hintBtn;
let resetBtn;
let nextBtn;

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    terminalInput = document.getElementById('terminal-input');
    terminalOutput = document.getElementById('terminal-output');
    workingFiles = document.getElementById('working-files');
    stagedFiles = document.getElementById('staged-files');
    commitHistory = document.getElementById('commit-history');
    branchTree = document.getElementById('branch-tree');
    levelList = document.getElementById('level-list');
    levelInstructions = document.getElementById('level-instructions');
    scoreDisplay = document.getElementById('score');
    hintBtn = document.getElementById('hint-btn');
    resetBtn = document.getElementById('reset-btn');
    nextBtn = document.getElementById('next-btn');

    // Initialize event listeners
    initEventListeners();

    // Load the first level
    loadLevel(1);

    // Add welcome message to terminal
    addTerminalOutput("Git Oyununa Hoş Geldiniz! Başlamak için komutları yazın.", "success");
    addTerminalOutput("İpucu: Her seviyede belirli görevleri tamamlamanız gerekiyor.", "info");
});

// Initialize event listeners
function initEventListeners() {
    // Terminal input
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();
            if (command) {
                processCommand(command);
                terminalInput.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            // Komut geçmişinde yukarı git
            e.preventDefault();
            if (historyPosition > 0) {
                historyPosition--;
                terminalInput.value = commandHistory[historyPosition];
                // İmleci sona taşı
                setTimeout(() => {
                    terminalInput.selectionStart = terminalInput.selectionEnd = terminalInput.value.length;
                }, 0);
            }
        } else if (e.key === 'ArrowDown') {
            // Komut geçmişinde aşağı git
            e.preventDefault();
            if (historyPosition < commandHistory.length - 1) {
                historyPosition++;
                terminalInput.value = commandHistory[historyPosition];
            } else if (historyPosition === commandHistory.length - 1) {
                historyPosition = commandHistory.length;
                terminalInput.value = '';
            }
        } else if (e.key === 'Tab') {
            // Otomatik tamamlama
            e.preventDefault();
            autoCompleteCommand();
        }
    });

    // Komut etiketleri
    document.querySelectorAll('.command-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const command = tag.getAttribute('data-command');
            insertCommand(command);
        });
    });

    // Level selection
    levelList.addEventListener('click', (e) => {
        const levelItem = e.target.closest('.level');
        if (levelItem) {
            const levelId = parseInt(levelItem.dataset.level);
            loadLevel(levelId);
        }
    });

    // Hint button
    hintBtn.addEventListener('click', () => {
        showHint();
    });

    // Reset button
    resetBtn.addEventListener('click', () => {
        resetLevel();
    });

    // Next button
    nextBtn.addEventListener('click', () => {
        const nextLevelId = gameState.currentLevel + 1;
        if (nextLevelId <= gameLevels.length) {
            loadLevel(nextLevelId);
        }
    });
}

// Komut ekle
function insertCommand(command) {
    terminalInput.value = command;
    terminalInput.focus();
    // İmleci uygun konuma getir
    if (command === 'git commit -m "mesaj"') {
        const cursorPos = command.indexOf('mesaj');
        setTimeout(() => {
            terminalInput.setSelectionRange(cursorPos, cursorPos + 5);
        }, 0);
    }
}

// Load a specific level
function loadLevel(levelId) {
    // Find the level
    const level = gameLevels.find(level => level.id === levelId);
    if (!level) return;

    // Update game state
    gameState.currentLevel = levelId;
    gameState.workingDirectory = [...level.initialFiles];
    gameState.stagingArea = [];
    gameState.repository = [];
    gameState.initialized = false;
    
    // If this is level 1, reset branches
    if (levelId === 1) {
        gameState.branches = ['main'];
        gameState.currentBranch = 'main';
    }

    // Update UI
    updateLevelSelection(levelId);
    updateLevelInstructions(level);
    updateFileVisualization();
    updateBranchVisualization();
    
    // Clear terminal
    terminalOutput.innerHTML = '';
    addTerminalOutput(`Seviye ${levelId}: ${level.title}`, "success");
    addTerminalOutput("Yukarıdaki talimatları takip edin ve görevleri tamamlayın.", "info");
    
    // Disable next button
    nextBtn.disabled = true;
}

// Terminal komut geçmişi ve mevcut pozisyon
let commandHistory = [];
let historyPosition = -1;

// Process terminal commands
function processCommand(command) {
    // Boş komutları işleme
    if (!command.trim()) {
        return;
    }
    
    // Add command to terminal
    addTerminalCommand(command);
    
    // Add to command history
    gameState.commandHistory.push(command);
    commandHistory.push(command);
    historyPosition = commandHistory.length;
    
    // Process Git commands
    if (command.startsWith('git ')) {
        processGitCommand(command);
    } else if (command === 'clear' || command === 'cls') {
        clearTerminal();
    } else if (command === 'help') {
        showHelp();
    } else if (command.startsWith('cd ')) {
        simulateChangeDirectory(command);
    } else if (command === 'ls' || command === 'dir') {
        listFiles();
    } else if (command === 'pwd') {
        showCurrentDirectory();
    } else if (command.startsWith('echo ')) {
        echoCommand(command);
    } else if (command.startsWith('touch ') || command.startsWith('new-item ')) {
        createFile(command);
    } else if (command === 'whoami') {
        addTerminalOutput('git-user', 'info');
    } else {
        addTerminalOutput(`Komut bulunamadı: ${command}. Yardım için 'help' yazın.`, "error");
    }
    
    // Check if level is completed
    checkLevelCompletion();
}

// Process Git commands
function processGitCommand(command) {
    const currentLevel = gameLevels.find(level => level.id === gameState.currentLevel);
    
    // Handle different Git commands
    if (command === 'git init') {
        if (gameState.initialized) {
            addTerminalOutput("Git deposu zaten başlatılmış.", "warning");
        } else {
            gameState.initialized = true;
            addTerminalOutput("Boş bir Git deposu başlatıldı (.git/ dizininde)", "success");
            markTaskCompleted(command);
        }
    } 
    else if (command === 'git status') {
        showGitStatus();
        markTaskCompleted(command);
    }
    else if (command === 'git branch') {
        // Mevcut dalları listele
        if (gameState.branches.length === 0) {
            addTerminalOutput("Henüz hiçbir dal yok. İlk commit'i yaptıktan sonra 'main' dalı oluşacak.", "info");
        } else {
            gameState.branches.forEach(branch => {
                if (branch === gameState.currentBranch) {
                    addTerminalOutput(`* ${branch}`, "success"); // Aktif dal
                } else {
                    addTerminalOutput(`  ${branch}`, "info");
                }
            });
        }
    }
    else if (command.startsWith('git add ')) {
        const fileName = command.replace('git add ', '').trim();
        
        // git add . komutu - tüm dosyaları ekle
        if (fileName === '.' || fileName === '*') {
            const untrackedFiles = gameState.workingDirectory.filter(file => file.status === 'untracked' || file.status === 'modified');
            if (untrackedFiles.length === 0) {
                addTerminalOutput("Eklenecek değişiklik yok.", "info");
            } else {
                untrackedFiles.forEach(file => {
                    addToStagingArea(file.name);
                });
                addTerminalOutput(`${untrackedFiles.length} dosya hazırlama alanına eklendi.`, "success");
            }
        } else {
            addToStagingArea(fileName);
        }
        markTaskCompleted(command);
    } 
    else if (command.startsWith('git commit -m ')) {
        if (gameState.stagingArea.length === 0) {
            addTerminalOutput("Commit edilecek değişiklik yok. Önce 'git add' ile dosyaları hazırlama alanına ekleyin.", "error");
        } else {
            const message = command.match(/"([^"]+)"/);
            if (message) {
                createCommit(message[1]);
                markTaskCompleted(command);
            } else {
                addTerminalOutput("Geçerli bir commit mesajı belirtin: git commit -m \"mesaj\"", "error");
            }
        }
    }
    else if (command === 'git log') {
        showGitLog();
    }
    else if (command.startsWith('git branch ')) {
        const branchName = command.replace('git branch ', '').trim();
        if (branchName && !gameState.branches.includes(branchName)) {
            if (gameState.repository.length === 0) {
                addTerminalOutput("Henüz hiçbir commit yok. İlk commit'i yaptıktan sonra dal oluşturabilirsiniz.", "error");
            } else {
                gameState.branches.push(branchName);
                addTerminalOutput(`'${branchName}' dalı oluşturuldu.`, "success");
                updateBranchVisualization();
                markTaskCompleted(command);
            }
        } else if (branchName) {
            addTerminalOutput(`'${branchName}' dalı zaten var.`, "error");
        } else {
            addTerminalOutput("Lütfen bir dal adı belirtin.", "error");
        }
    } 
    else if (command.startsWith('git checkout ')) {
        const branchName = command.replace('git checkout ', '').trim();
        
        // Yeni dal oluşturma ve geçiş (-b parametresi)
        if (command.includes(' -b ')) {
            const newBranchName = branchName.replace('-b ', '').trim();
            if (!gameState.branches.includes(newBranchName)) {
                if (gameState.repository.length === 0) {
                    addTerminalOutput("Henüz hiçbir commit yok. İlk commit'i yaptıktan sonra dal oluşturabilirsiniz.", "error");
                } else {
                    gameState.branches.push(newBranchName);
                    gameState.currentBranch = newBranchName;
                    addTerminalOutput(`'${newBranchName}' dalı oluşturuldu ve geçildi.`, "success");
                    updateBranchVisualization();
                    markTaskCompleted(`git branch ${newBranchName}`);
                    markTaskCompleted(`git checkout ${newBranchName}`);
                }
            } else {
                addTerminalOutput(`'${newBranchName}' dalı zaten var.`, "error");
            }
        } 
        // Mevcut dala geçiş
        else if (gameState.branches.includes(branchName)) {
            if (branchName === gameState.currentBranch) {
                addTerminalOutput(`Zaten '${branchName}' dalındasınız.`, "info");
            } else {
                gameState.currentBranch = branchName;
                addTerminalOutput(`'${branchName}' dalına geçildi.`, "success");
                updateBranchVisualization();
                markTaskCompleted(command);
            }
        } else {
            addTerminalOutput(`'${branchName}' dalı bulunamadı.`, "error");
        }
    } 
    else if (command.startsWith('git merge ')) {
        const branchName = command.replace('git merge ', '').trim();
        if (gameState.branches.includes(branchName) && branchName !== gameState.currentBranch) {
            addTerminalOutput(`'${branchName}' dalı '${gameState.currentBranch}' dalına birleştirildi.`, "success");
            markTaskCompleted(command);
        } else if (branchName === gameState.currentBranch) {
            addTerminalOutput(`Zaten '${branchName}' dalındasınız.`, "warning");
        } else {
            addTerminalOutput(`'${branchName}' dalı bulunamadı.`, "error");
        }
    }
    else if (command === 'git remote') {
        addTerminalOutput("origin", "info");
    }
    else if (command === 'git remote -v') {
        addTerminalOutput("origin\thttps://example.com/repo.git (fetch)", "info");
        addTerminalOutput("origin\thttps://example.com/repo.git (push)", "info");
    }
    else if (command.startsWith('git remote add ')) {
        const parts = command.replace('git remote add ', '').trim().split(' ');
        if (parts.length >= 2) {
            const remoteName = parts[0];
            const remoteUrl = parts[1];
            addTerminalOutput(`'${remoteName}' adlı uzak repo eklendi (${remoteUrl}).`, "success");
            markTaskCompleted(command);
        } else {
            addTerminalOutput("Geçerli bir uzak repo adı ve URL'si belirtin.", "error");
        }
    } 
    else if (command.startsWith('git push ')) {
        const parts = command.replace('git push ', '').trim().split(' ');
        if (parts.length >= 1) {
            const remoteName = parts[0];
            const branchName = parts.length >= 2 ? parts[1] : gameState.currentBranch;
            
            addTerminalOutput(`Değişiklikler '${remoteName}' uzak reposuna gönderiliyor...`, "info");
            setTimeout(() => {
                addTerminalOutput("Enumeration objects: 5, done.", "info");
                addTerminalOutput("Counting objects: 100% (5/5), done.", "info");
                addTerminalOutput("Delta compression using up to 8 threads", "info");
                addTerminalOutput("Compressing objects: 100% (3/3), done.", "info");
                addTerminalOutput("Writing objects: 100% (3/3), 353 bytes | 353.00 KiB/s, done.", "info");
                addTerminalOutput("Total 3 (delta 2), reused 0 (delta 0)", "info");
                addTerminalOutput(`To ${remoteName === 'origin' ? 'https://example.com/repo.git' : remoteName}`, "info");
                addTerminalOutput(`   a1b2c3d..f7d2e3a  ${branchName} -> ${branchName}`, "success");
                markTaskCompleted(command);
            }, 1000);
        } else {
            addTerminalOutput("Geçerli bir uzak repo adı ve dal belirtin.", "error");
        }
    } 
    else if (command.startsWith('git pull ')) {
        const parts = command.replace('git pull ', '').trim().split(' ');
        if (parts.length >= 1) {
            const remoteName = parts[0];
            const branchName = parts.length >= 2 ? parts[1] : gameState.currentBranch;
            
            addTerminalOutput(`'${remoteName}' uzak reposundan değişiklikler alınıyor...`, "info");
            setTimeout(() => {
                addTerminalOutput("remote: Enumerating objects: 5, done.", "info");
                addTerminalOutput("remote: Counting objects: 100% (5/5), done.", "info");
                addTerminalOutput("remote: Compressing objects: 100% (2/2), done.", "info");
                addTerminalOutput("remote: Total 3 (delta 1), reused 3 (delta 1)", "info");
                addTerminalOutput("Unpacking objects: 100% (3/3), 340 bytes | 34.00 KiB/s, done.", "info");
                addTerminalOutput(`From ${remoteName === 'origin' ? 'https://example.com/repo.git' : remoteName}`, "info");
                addTerminalOutput(`   a1b2c3d..e5f6g7h  ${branchName}       -> ${remoteName}/${branchName}`, "info");
                addTerminalOutput(`Updating a1b2c3d..e5f6g7h`, "info");
                addTerminalOutput("Fast-forward", "info");
                addTerminalOutput(" README.md | 5 +++++", "info");
                addTerminalOutput(" 1 file changed, 5 insertions(+)", "success");
                markTaskCompleted(command);
            }, 1000);
        } else {
            addTerminalOutput("Geçerli bir uzak repo adı ve dal belirtin.", "error");
        }
    }
    else if (command === 'git --version') {
        addTerminalOutput("git version 2.40.0", "info");
    }
    else if (command === 'git help') {
        addTerminalOutput("Git'in en çok kullanılan komutları:", "info");
        addTerminalOutput("   add        Dosyaları hazırlama alanına ekler", "info");
        addTerminalOutput("   branch     Dal oluşturur, listeler veya siler", "info");
        addTerminalOutput("   checkout   Dallara geçiş yapar", "info");
        addTerminalOutput("   commit     Değişiklikleri kaydeder", "info");
        addTerminalOutput("   diff       Değişiklikleri gösterir", "info");
        addTerminalOutput("   init       Yeni bir Git deposu oluşturur", "info");
        addTerminalOutput("   log        Commit geçmişini gösterir", "info");
        addTerminalOutput("   merge      İki veya daha fazla geliştirme geçmişini birleştirir", "info");
        addTerminalOutput("   pull       Uzak repodan değişiklikleri çeker ve birleştirir", "info");
        addTerminalOutput("   push       Değişiklikleri uzak repoya gönderir", "info");
        addTerminalOutput("   status     Çalışma dizininin durumunu gösterir", "info");
    }
    else {
        addTerminalOutput(`Git komutu tanınmıyor: ${command}`, "error");
        addTerminalOutput("Yardım için 'git help' yazabilirsiniz.", "info");
    }
}

// Git log komutunu göster
function showGitLog() {
    if (gameState.repository.length === 0) {
        addTerminalOutput("Henüz hiçbir commit yok.", "info");
        return;
    }
    
    // En son commit'ten başlayarak göster
    const commits = [...gameState.repository].reverse();
    
    commits.forEach(commit => {
        addTerminalOutput(`commit ${commit.hash}`, "info");
        addTerminalOutput(`Author: Git User <git.user@example.com>`, "info");
        addTerminalOutput(`Date:   ${new Date().toISOString()}`, "info");
        addTerminalOutput("", "info");
        addTerminalOutput(`    ${commit.message}`, "success");
        addTerminalOutput("", "info");
    });
}

// Add file to staging area
function addToStagingArea(fileName) {
    const fileIndex = gameState.workingDirectory.findIndex(file => file.name === fileName);
    
    if (fileIndex !== -1) {
        const file = gameState.workingDirectory[fileIndex];
        
        // Check if file is already staged
        const stagedIndex = gameState.stagingArea.findIndex(stagedFile => stagedFile.name === fileName);
        if (stagedIndex !== -1) {
            addTerminalOutput(`'${fileName}' zaten hazırlama alanında.`, "warning");
            return;
        }
        
        // Add to staging area
        gameState.stagingArea.push({...file, status: 'staged'});
        
        // Update file status in working directory
        gameState.workingDirectory[fileIndex].status = 'staged';
        
        addTerminalOutput(`'${fileName}' hazırlama alanına eklendi.`, "success");
        updateFileVisualization();
    } else {
        addTerminalOutput(`'${fileName}' dosyası bulunamadı.`, "error");
    }
}

// Create a commit
function createCommit(message) {
    const commitHash = generateCommitHash();
    const stagedFiles = [...gameState.stagingArea];
    
    // Add commit to repository
    gameState.repository.push({
        hash: commitHash,
        message: message,
        branch: gameState.currentBranch,
        files: stagedFiles
    });
    
    // Update file status in working directory
    gameState.stagingArea.forEach(stagedFile => {
        const fileIndex = gameState.workingDirectory.findIndex(file => file.name === stagedFile.name);
        if (fileIndex !== -1) {
            gameState.workingDirectory[fileIndex].status = 'committed';
        }
    });
    
    // Clear staging area
    gameState.stagingArea = [];
    
    addTerminalOutput(`[${gameState.currentBranch} ${commitHash.substring(0, 7)}] ${message}`, "success");
    addTerminalOutput(`${stagedFiles.length} dosya değiştirildi`, "info");
    
    updateFileVisualization();
    updateCommitHistory();
}

// Show Git status
function showGitStatus() {
    addTerminalOutput(`Dal: ${gameState.currentBranch}`, "info");
    
    if (gameState.stagingArea.length > 0) {
        addTerminalOutput("Commit için hazırlanan değişiklikler:", "info");
        addTerminalOutput("  (commit için \"git commit -m \"mesaj\"\" kullanın)", "info");
        gameState.stagingArea.forEach(file => {
            addTerminalOutput(`        ${file.status === 'modified' ? 'değiştirildi:' : 'yeni dosya:'} ${file.name}`, "success");
        });
    }
    
    const untrackedFiles = gameState.workingDirectory.filter(file => file.status === 'untracked');
    if (untrackedFiles.length > 0) {
        addTerminalOutput("Takip edilmeyen dosyalar:", "info");
        addTerminalOutput("  (commit için \"git add <dosya>...\" kullanın)", "info");
        untrackedFiles.forEach(file => {
            addTerminalOutput(`        ${file.name}`, "error");
        });
    }
    
    if (gameState.stagingArea.length === 0 && untrackedFiles.length === 0) {
        addTerminalOutput("Commit edilecek değişiklik yok, çalışma dizini temiz", "success");
    }
}

// Mark a task as completed
function markTaskCompleted(command) {
    const currentLevel = gameLevels.find(level => level.id === gameState.currentLevel);
    if (!currentLevel) return;
    
    const taskIndex = currentLevel.tasks.findIndex(task => {
        // Check if the command matches the task
        return command.trim().toLowerCase() === task.command.trim().toLowerCase() ||
               // Special case for git add, to allow for different file names
               (command.startsWith('git add ') && task.command.startsWith('git add ') && 
                command.split(' ')[2] === task.command.split(' ')[2]);
    });
    
    if (taskIndex !== -1 && !currentLevel.tasks[taskIndex].completed) {
        currentLevel.tasks[taskIndex].completed = true;
        gameState.score += 10;
        scoreDisplay.textContent = gameState.score;
        
        // Update level instructions to show completed tasks
        updateLevelInstructions(currentLevel);
    }
}

// Check if all tasks in the current level are completed
function checkLevelCompletion() {
    const currentLevel = gameLevels.find(level => level.id === gameState.currentLevel);
    if (!currentLevel) return;
    
    const allTasksCompleted = currentLevel.tasks.every(task => task.completed);
    
    if (allTasksCompleted && !gameState.completedLevels.includes(gameState.currentLevel)) {
        gameState.completedLevels.push(gameState.currentLevel);
        gameState.score += 50; // Bonus for completing the level
        scoreDisplay.textContent = gameState.score;
        
        addTerminalOutput(`Tebrikler! Seviye ${gameState.currentLevel} tamamlandı! +50 bonus puan kazandınız.`, "success");
        
        // Mark level as completed in UI
        const levelItem = document.querySelector(`.level[data-level="${gameState.currentLevel}"]`);
        if (levelItem) {
            levelItem.classList.add('completed');
        }
        
        // Enable next button if there's a next level
        if (gameState.currentLevel < gameLevels.length) {
            nextBtn.disabled = false;
        }
    }
}

// Show hint for the current level
function showHint() {
    const currentLevel = gameLevels.find(level => level.id === gameState.currentLevel);
    if (currentLevel) {
        addTerminalOutput("İPUCU: " + currentLevel.hint, "warning");
    }
}

// Reset the current level
function resetLevel() {
    loadLevel(gameState.currentLevel);
    addTerminalOutput("Seviye sıfırlandı.", "warning");
}

// Update the level selection UI
function updateLevelSelection(levelId) {
    const levelItems = levelList.querySelectorAll('.level');
    levelItems.forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.level) === levelId) {
            item.classList.add('active');
        }
    });
}

// Update the level instructions UI
function updateLevelInstructions(level) {
    let instructionsHTML = `<h4>${level.title}</h4>`;
    instructionsHTML += `<p>${level.instructions}</p>`;
    
    // Add task list with completion status
    instructionsHTML += '<ul class="task-list">';
    level.tasks.forEach(task => {
        const taskClass = task.completed ? 'completed-task' : '';
        const checkIcon = task.completed ? '✓ ' : '';
        instructionsHTML += `<li class="${taskClass}">${checkIcon}${task.command}</li>`;
    });
    instructionsHTML += '</ul>';
    
    levelInstructions.innerHTML = instructionsHTML;
}

// Update the file visualization
function updateFileVisualization() {
    // Update working directory
    workingFiles.innerHTML = '';
    gameState.workingDirectory.forEach(file => {
        if (file.status !== 'committed') {
            const fileItem = document.createElement('div');
            fileItem.className = `file-item ${file.status}`;
            fileItem.innerHTML = `<i class="fab ${file.icon}"></i> ${file.name}`;
            workingFiles.appendChild(fileItem);
        }
    });
    
    // Update staging area
    stagedFiles.innerHTML = '';
    gameState.stagingArea.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = `file-item ${file.status}`;
        fileItem.innerHTML = `<i class="fab ${file.icon}"></i> ${file.name}`;
        stagedFiles.appendChild(fileItem);
    });
}

// Update the commit history
function updateCommitHistory() {
    commitHistory.innerHTML = '';
    
    // Get commits for the current branch
    const branchCommits = gameState.repository
        .filter(commit => commit.branch === gameState.currentBranch)
        .reverse(); // Show newest first
    
    branchCommits.forEach(commit => {
        const commitItem = document.createElement('div');
        commitItem.className = 'commit-item';
        commitItem.innerHTML = `
            <div class="commit-hash">${commit.hash.substring(0, 7)}</div>
            <div class="commit-message">${commit.message}</div>
        `;
        commitHistory.appendChild(commitItem);
    });
}

// Update the branch visualization
function updateBranchVisualization() {
    branchTree.innerHTML = '';
    
    // Create main branch
    const mainBranch = document.createElement('div');
    mainBranch.className = 'branch main-branch';
    
    // Create branch label
    const mainLabel = document.createElement('div');
    mainLabel.className = 'branch-label main';
    mainLabel.textContent = 'main';
    mainLabel.style.left = '10px';
    
    // Add commits to main branch
    const mainCommits = gameState.repository.filter(commit => commit.branch === 'main');
    mainCommits.forEach((commit, index) => {
        const commitDot = document.createElement('div');
        commitDot.className = 'branch-commit main';
        commitDot.style.left = `${50 + index * 80}px`;
        commitDot.title = `${commit.hash.substring(0, 7)}: ${commit.message}`;
        mainBranch.appendChild(commitDot);
    });
    
    branchTree.appendChild(mainBranch);
    branchTree.appendChild(mainLabel);
    
    // Create feature branches
    gameState.branches.forEach(branch => {
        if (branch !== 'main') {
            const featureBranch = document.createElement('div');
            featureBranch.className = 'branch feature-branch';
            featureBranch.style.top = '50px';
            
            // Create branch label
            const branchLabel = document.createElement('div');
            branchLabel.className = 'branch-label feature';
            branchLabel.textContent = branch;
            branchLabel.style.left = '10px';
            branchLabel.style.top = '25px';
            
            // Add commits to feature branch
            const branchCommits = gameState.repository.filter(commit => commit.branch === branch);
            branchCommits.forEach((commit, index) => {
                const commitDot = document.createElement('div');
                commitDot.className = 'branch-commit feature';
                commitDot.style.left = `${50 + index * 80}px`;
                commitDot.title = `${commit.hash.substring(0, 7)}: ${commit.message}`;
                featureBranch.appendChild(commitDot);
            });
            
            branchTree.appendChild(featureBranch);
            branchTree.appendChild(branchLabel);
        }
    });
    
    // Highlight current branch
    const currentBranchLabel = branchTree.querySelector(`.branch-label:not(.main)`);
    if (currentBranchLabel && currentBranchLabel.textContent === gameState.currentBranch) {
        currentBranchLabel.style.fontWeight = 'bold';
    }
}

// Add terminal command to output
function addTerminalCommand(command) {
    const commandElement = document.createElement('div');
    commandElement.className = 'terminal-command';
    commandElement.textContent = command;
    terminalOutput.appendChild(commandElement);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Add terminal output
function addTerminalOutput(message, type = '') {
    const outputElement = document.createElement('div');
    outputElement.className = `terminal-output ${type}`;
    outputElement.textContent = message;
    terminalOutput.appendChild(outputElement);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Terminal yardım komutunu göster
function showHelp() {
    addTerminalOutput('Kullanılabilir komutlar:', 'info');
    addTerminalOutput('  git init                    - Yeni bir Git deposu oluşturur', 'info');
    addTerminalOutput('  git status                  - Çalışma dizininin durumunu gösterir', 'info');
    addTerminalOutput('  git add <dosya>             - Dosyayı hazırlama alanına ekler', 'info');
    addTerminalOutput('  git commit -m "mesaj"       - Değişiklikleri kaydeder', 'info');
    addTerminalOutput('  git branch <dal-adı>        - Yeni bir dal oluşturur', 'info');
    addTerminalOutput('  git checkout <dal-adı>      - Belirtilen dala geçer', 'info');
    addTerminalOutput('  git merge <dal-adı>         - Belirtilen dalı mevcut dala birleştirir', 'info');
    addTerminalOutput('  git remote add <ad> <url>   - Uzak repo ekler', 'info');
    addTerminalOutput('  git push <uzak> <dal>       - Değişiklikleri uzak repoya gönderir', 'info');
    addTerminalOutput('  git pull <uzak> <dal>       - Değişiklikleri uzak repodan çeker', 'info');
    addTerminalOutput('', 'info');
    addTerminalOutput('Diğer komutlar:', 'info');
    addTerminalOutput('  clear                       - Terminal ekranını temizler', 'info');
    addTerminalOutput('  ls                          - Dosyaları listeler', 'info');
    addTerminalOutput('  cd <dizin>                  - Dizin değiştirir (simülasyon)', 'info');
    addTerminalOutput('  pwd                         - Mevcut dizini gösterir', 'info');
    addTerminalOutput('  touch <dosya>               - Yeni dosya oluşturur', 'info');
    addTerminalOutput('  echo <metin>                - Metni ekrana yazdırır', 'info');
    addTerminalOutput('  help                        - Bu yardım mesajını gösterir', 'info');
}

// Terminal ekranını temizle
function clearTerminal() {
    terminalOutput.innerHTML = '';
    addTerminalOutput('Terminal temizlendi.', 'info');
}

// Dizin değiştirmeyi simüle et
function simulateChangeDirectory(command) {
    const dir = command.replace('cd ', '').trim();
    addTerminalOutput(`Dizin değiştirildi: ${dir}`, 'info');
}

// Dosyaları listele
function listFiles() {
    addTerminalOutput('Dosya listesi:', 'info');
    gameState.workingDirectory.forEach(file => {
        addTerminalOutput(`  ${file.name}`, 'info');
    });
}

// Mevcut dizini göster
function showCurrentDirectory() {
    addTerminalOutput('/home/git-user/proje', 'info');
}

// Echo komutu
function echoCommand(command) {
    const text = command.replace('echo ', '').trim();
    addTerminalOutput(text, 'info');
}

// Yeni dosya oluştur
function createFile(command) {
    const fileName = command.replace(/^(touch|new-item)\s+/, '').trim();
    if (fileName) {
        // Dosya zaten var mı kontrol et
        const existingFile = gameState.workingDirectory.find(file => file.name === fileName);
        if (existingFile) {
            addTerminalOutput(`'${fileName}' dosyası zaten var.`, 'warning');
            return;
        }
        
        // Dosya uzantısına göre icon belirle
        let icon = 'fa-file';
        if (fileName.endsWith('.html')) icon = 'fa-html5';
        else if (fileName.endsWith('.css')) icon = 'fa-css3-alt';
        else if (fileName.endsWith('.js')) icon = 'fa-js';
        else if (fileName.endsWith('.md')) icon = 'fa-markdown';
        
        // Dosyayı ekle
        gameState.workingDirectory.push({
            name: fileName,
            status: 'untracked',
            icon: icon
        });
        
        updateFileVisualization();
        addTerminalOutput(`'${fileName}' dosyası oluşturuldu.`, 'success');
    } else {
        addTerminalOutput('Lütfen bir dosya adı belirtin.', 'error');
    }
}

// Otomatik tamamlama
function autoCompleteCommand() {
    const input = terminalInput.value.trim();
    
    // Git komutlarını otomatik tamamla
    const gitCommands = ['git init', 'git status', 'git add ', 'git commit -m "', 'git branch ', 'git checkout ', 'git merge ', 'git remote add ', 'git push ', 'git pull '];
    const otherCommands = ['clear', 'help', 'ls', 'cd ', 'pwd', 'touch ', 'echo ', 'whoami'];
    
    // Git komutlarını kontrol et
    if (input.startsWith('git')) {
        for (const cmd of gitCommands) {
            if (cmd.startsWith(input)) {
                terminalInput.value = cmd;
                return;
            }
        }
    }
    
    // Diğer komutları kontrol et
    for (const cmd of otherCommands) {
        if (cmd.startsWith(input)) {
            terminalInput.value = cmd;
            return;
        }
    }
    
    // Dosya adlarını otomatik tamamla (git add için)
    if (input.startsWith('git add ')) {
        const partial = input.replace('git add ', '').trim();
        for (const file of gameState.workingDirectory) {
            if (file.name.startsWith(partial)) {
                terminalInput.value = `git add ${file.name}`;
                return;
            }
        }
    }
}

// Generate a random commit hash
function generateCommitHash() {
    const characters = 'abcdef0123456789';
    let hash = '';
    for (let i = 0; i < 40; i++) {
        hash += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return hash;
}

// Handle dark mode toggle (if present in the main site)
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
            }
        });
    }
});
