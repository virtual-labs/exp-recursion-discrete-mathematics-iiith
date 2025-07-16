// Tower of Hanoi Game Implementation

class TowerOfHanoi {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.diskCount = 3;
        this.towers = [[], [], []];
        this.moveCount = 0;
        this.startTime = null;
        this.gameWon = false;
        this.selectedDisk = null;
        this.selectedTower = null;
        this.isAnimating = false;
        this.autoSolving = false;
        this.userHasPlayed = false;
        this.animationSpeed = 5;
        this.moveHistory = [];
        this.hintMove = null;
        this.invalidMoveTower = null;
        
        // Auto-solve step-by-step functionality
        this.autoSteps = [];
        this.currentStepIndex = 0;
        this.isStepMode = false;
        
        // Undo functionality - Queue-based move history
        this.moveQueue = []; // Stack of moves that can be undone
        
        // Recursion visualization
        this.recursionHighlight = {
            active: false,
            from: null,
            to: null,
            aux: null,
            n: null,
            message: ''
        };
        
        // Colors for disks
        this.diskColors = [
            '#ef4444', '#f97316', '#eab308', '#22c55e',
            '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
        ];
        
        // Initialize responsive dimensions
        this.setupCanvas();
        this.calculateDimensions();
        this.initializeGame();
        this.attachEventListeners();
        this.gameLoop();
    }
    
    setupCanvas() {
        // Set up responsive canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerStyle = window.getComputedStyle(container);
        const containerWidth = container.clientWidth - 
            parseFloat(containerStyle.paddingLeft) - 
            parseFloat(containerStyle.paddingRight);
        
        const aspectRatio = window.innerWidth > 1024 ? 2.2 : 2;
        const containerHeight = Math.min(containerWidth / aspectRatio, 350);
        
        this.canvas.style.width = containerWidth + 'px';
        this.canvas.style.height = containerHeight + 'px';
        
        const scale = window.devicePixelRatio || 1;
        this.canvas.width = containerWidth * scale;
        this.canvas.height = containerHeight * scale;
        
        this.ctx.scale(scale, scale);
        this.calculateDimensions();
        
        if (this.towers) {
            this.draw();
        }
    }
    
    calculateDimensions() {
        const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
        
        // Responsive visual constants
        this.towerWidth = Math.max(8, canvasWidth * 0.015);
        this.towerHeight = canvasHeight * 0.5;
        this.diskHeight = Math.max(15, canvasHeight * 0.05);
        this.maxDiskWidth = Math.min(120, canvasWidth * 0.15);
        this.minDiskWidth = Math.max(30, canvasWidth * 0.05);
        this.baseY = canvasHeight * 0.85;
        
        // Calculate tower positions
        this.towerX = [
            canvasWidth * 0.2,
            canvasWidth * 0.5,
            canvasWidth * 0.8
        ];
    }
    
    initializeGame() {
        this.towers = [[], [], []];
        this.moveCount = 0;
        this.startTime = null;
        this.gameWon = false;
        this.selectedDisk = null;
        this.selectedTower = null;
        this.isAnimating = false;
        this.autoSolving = false;
        this.userHasPlayed = false;
        this.moveHistory = [];
        this.hintMove = null;
        this.invalidMoveTower = null;

        // Reset auto-solve step mode
        this.autoSteps = [];
        this.currentStepIndex = 0;
        this.isStepMode = false;
        this.hideRecursionOverlay();

        // Reset recursion highlighting
        this.recursionHighlight.active = false;

        // Reset undo queue properly
        this.moveQueue = [];

        // Place all disks on the first tower
        for (let i = this.diskCount; i >= 1; i--) {
            this.towers[0].push({
                size: i,
                color: this.diskColors[i - 1],
                id: i
            });
        }

        this.updateDisplay();
        this.updateMoveHistoryDisplay();
        this.draw();
        this.updateAutoSolveButtons();
    }
    
    // Queue-based move tracking for undo functionality
    addMoveToQueue(from, to, disk) {
        const move = {
            from: from,
            to: to,
            disk: disk,
            moveNumber: this.moveCount,
            timestamp: Date.now()
        };
        this.moveQueue.push(move);
        this.updateUndoButton();
    }
    
    updateUndoButton() {
        const undoBtn = document.getElementById('undoBtn');
        if (undoBtn) {
            undoBtn.disabled = this.moveQueue.length === 0 || this.isAnimating || this.autoSolving || this.isStepMode;
            if (undoBtn.disabled) {
                undoBtn.className = 'btn w-full bg-gray-400 text-gray-600 font-bold py-1.5 px-3 rounded text-xs cursor-not-allowed';
            } else {
                undoBtn.className = 'btn w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1.5 px-3 rounded text-xs';
            }
        }
    }
    
    attachEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Keyboard controls
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    
    handleMouseDown(event) {
        if (this.isAnimating || this.autoSolving || this.isStepMode) return; // Add isStepMode check
        
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Check if clicking on a disk
        const clickedDisk = this.getDiskAt(x, y);
        if (clickedDisk) {
            this.selectedDisk = clickedDisk.disk;
            this.selectedTower = clickedDisk.tower;
        }
    }
    
    handleMouseMove(event) {
        if (!this.selectedDisk || this.isAnimating || this.isStepMode) return; // Add isStepMode check
        
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Visual feedback for dragging
        this.draw();
        this.drawDiskAt(this.selectedDisk, x - this.getDiskWidth(this.selectedDisk.size) / 2, y - this.diskHeight / 2);
    }
    
    handleMouseUp(event) {
        if (!this.selectedDisk || this.isAnimating || this.isStepMode) return; // Add isStepMode check
        
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Determine target tower
        const targetTower = this.getTowerAt(x);
        
        if (targetTower !== null && targetTower !== this.selectedTower) {
            this.makeMove(this.selectedTower, targetTower);
        }
        
        this.selectedDisk = null;
        this.selectedTower = null;
        this.draw();
    }
    
    handleKeyDown(event) {
        if (this.isAnimating || this.autoSolving || this.isStepMode) return; // Add isStepMode check
        
        switch(event.key) {
            case '1':
            case '2':
            case '3':
                const tower = parseInt(event.key) - 1;
                if (this.selectedTower === null) {
                    // Select top disk from this tower
                    if (this.towers[tower].length > 0) {
                        this.selectedDisk = this.towers[tower][this.towers[tower].length - 1];
                        this.selectedTower = tower;
                    }
                } else {
                    // Try to move to this tower
                    if (tower !== this.selectedTower) {
                        this.makeMove(this.selectedTower, tower);
                    }
                    this.selectedDisk = null;
                    this.selectedTower = null;
                }
                break;
            case ' ':
                event.preventDefault();
                // Toggle selection
                if (this.selectedDisk) {
                    this.selectedDisk = null;
                    this.selectedTower = null;
                } else {
                    // Select from tower 1 by default
                    if (this.towers[0].length > 0) {
                        this.selectedDisk = this.towers[0][this.towers[0].length - 1];
                        this.selectedTower = 0;
                    }
                }
                break;
            case 'r':
            case 'R':
                this.initializeGame();
                break;
            case 'h':
            case 'H':
                // this.showHint();
                break;
        }
        this.draw();
    }
    
    getDiskAt(x, y) {
        for (let towerIndex = 0; towerIndex < 3; towerIndex++) {
            const tower = this.towers[towerIndex];
            for (let diskIndex = tower.length - 1; diskIndex >= 0; diskIndex--) {
                const disk = tower[diskIndex];
                const diskX = this.towerX[towerIndex] - this.getDiskWidth(disk.size) / 2;
                const diskY = this.baseY - (diskIndex + 1) * this.diskHeight;
                const diskWidth = this.getDiskWidth(disk.size);
                
                if (x >= diskX && x <= diskX + diskWidth && 
                    y >= diskY && y <= diskY + this.diskHeight) {
                    // Only return if this is the top disk
                    if (diskIndex === tower.length - 1) {
                        return { disk, tower: towerIndex };
                    }
                }
            }
        }
        return null;
    }
    
    getTowerAt(x) {
        const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
        const tolerance = canvasWidth * 0.1; // 10% of canvas width as tolerance
        
        for (let i = 0; i < 3; i++) {
            if (Math.abs(x - this.towerX[i]) < tolerance) {
                return i;
            }
        }
        return null;
    }
    
    getDiskWidth(size) {
        return this.minDiskWidth + (size - 1) * (this.maxDiskWidth - this.minDiskWidth) / (this.diskCount - 1);
    }
    
    isValidMove(fromTower, toTower) {
        if (fromTower === toTower) return false;
        if (this.towers[fromTower].length === 0) return false;
        if (this.towers[toTower].length === 0) return true;
        
        const topDiskFrom = this.towers[fromTower][this.towers[fromTower].length - 1];
        const topDiskTo = this.towers[toTower][this.towers[toTower].length - 1];
        
        return topDiskFrom.size < topDiskTo.size;
    }
    
    _executeMove(from, to, isUserMove) {
        if (!this.isValidMove(from, to)) {
            if (isUserMove) this.showInvalidMoveAnimation(from);
            return false;
        }

        if (isUserMove && !this.startTime) {
            this.startTime = Date.now();
        }

        const disk = this.towers[from].pop();
        this.towers[to].push(disk);

        if (isUserMove) {
            this.userHasPlayed = true;
            this.addMoveToQueue(from, to, disk);
        }

        this.moveCount++;
        this.addMoveToHistory(from + 1, to + 1, disk);

        this.updateDisplay();

        if (this.checkWinCondition()) {
            this.gameWon = true;
            if (isUserMove) {
                this.showWinAnimation();
            }
        }

        if (isUserMove) {
            this.updateUndoButton();
        }
        
        this.draw();
        return true;
    }

    makeMove(fromTower, toTower) {
        return this._executeMove(fromTower, toTower, true);
    }
    
    addMoveToHistory(from, to, disk) {
        const move = {
            number: this.moveCount,
            from: from,
            to: to,
            disk: disk,
            time: this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0
        };
        
        this.moveHistory.push(move);
        this.updateMoveHistoryDisplay();
    }
    
    updateMoveHistoryDisplay() {
        const historyElement = document.getElementById('moveHistory');
        if (this.moveHistory.length === 0) {
            historyElement.innerHTML = '<p class="text-sm text-gray-600">No moves yet</p>';
            return;
        }
        
        const recentMoves = this.moveHistory.slice(-10); // Show last 10 moves
        historyElement.innerHTML = recentMoves.map(move => 
            `<div class="move-item">
                <span class="move-number">${move.number}</span>
                <span class="move-description">Tower ${move.from} → Tower ${move.to}</span>
                <span class="move-time">${move.time}s</span>
            </div>`
        ).join('');
        
        // Auto-scroll to bottom to show latest move
        setTimeout(() => {
            historyElement.scrollTop = historyElement.scrollHeight;
        }, 50);
    }
    
    showInvalidMoveAnimation(tower) {
        // Briefly highlight the tower in red
        this.invalidMoveTower = tower;
        setTimeout(() => {
            this.invalidMoveTower = null;
            this.draw();
        }, 500);
        this.draw();
    }
    
    checkWinCondition() {
        return this.towers[2].length === this.diskCount;
    }
    
    showWinAnimation() {
        // Add celebration effect
        this.canvas.classList.add('success-effect');
        setTimeout(() => {
            this.canvas.classList.remove('success-effect');
        }, 2000);
        
        // Show congratulations message
        setTimeout(() => {
            const optimal = Math.pow(2, this.diskCount) - 1;
            const efficiency = Math.round((optimal / this.moveCount) * 100);
            alert(`🎉 Congratulations! You solved it in ${this.moveCount} moves!\n` +
                  `Optimal solution: ${optimal} moves\n` +
                  `Efficiency: ${efficiency}%`);
        }, 500);
    }
    
    updateDisplay() {
        document.getElementById('moveCount').textContent = this.moveCount;
        document.getElementById('optimalMoves').textContent = Math.pow(2, this.diskCount) - 1;
        
        if (this.startTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('timeElapsed').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    draw() {
        const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
        
        // Clear canvas
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw base
        this.ctx.fillStyle = '#6b7280';
        this.ctx.fillRect(canvasWidth * 0.1, this.baseY, canvasWidth * 0.8, canvasHeight * 0.025);
        
        // Draw towers
        for (let i = 0; i < 3; i++) {
            // Determine tower color based on state
            let towerColor = '#6b7280'; // Default gray
            
            if (this.invalidMoveTower === i) {
                towerColor = '#ef4444'; // Red for invalid move
            } else if (this.recursionHighlight.active) {
                if (i === this.recursionHighlight.from) {
                    towerColor = '#f59e0b'; // Orange for source
                } else if (i === this.recursionHighlight.to) {
                    towerColor = '#10b981'; // Green for destination
                } else if (i === this.recursionHighlight.aux) {
                    towerColor = '#8b5cf6'; // Purple for auxiliary
                }
            }
            
            this.ctx.fillStyle = towerColor;
            this.ctx.fillRect(
                this.towerX[i] - this.towerWidth / 2,
                this.baseY - this.towerHeight,
                this.towerWidth,
                this.towerHeight
            );
            
            // Draw tower labels
            this.ctx.fillStyle = '#374151';
            this.ctx.font = `bold ${Math.max(12, canvasWidth * 0.02)}px Poppins`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`Tower ${i + 1}`, this.towerX[i], this.baseY + canvasHeight * 0.06);
            
            // Draw recursion indicators
            if (this.recursionHighlight.active) {
                this.drawRecursionIndicator(i, canvasWidth, canvasHeight);
            }
        }
        
        // Draw disks
        for (let towerIndex = 0; towerIndex < 3; towerIndex++) {
            const tower = this.towers[towerIndex];
            for (let diskIndex = 0; diskIndex < tower.length; diskIndex++) {
                const disk = tower[diskIndex];
                if (disk === this.selectedDisk) continue; // Don't draw selected disk here
                
                const x = this.towerX[towerIndex] - this.getDiskWidth(disk.size) / 2;
                const y = this.baseY - (diskIndex + 1) * this.diskHeight;
                
                this.drawDiskAt(disk, x, y);
            }
        }
        
        // Draw hint if active
        if (this.hintMove) {
            this.drawHint();
        }
    }
    
    drawDiskAt(disk, x, y) {
        const width = this.getDiskWidth(disk.size);
        
        // Disk shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(x + 2, y + 2, width, this.diskHeight);
        
        // Disk body
        this.ctx.fillStyle = disk.color;
        this.ctx.fillRect(x, y, width, this.diskHeight);
        
        // Disk border
        this.ctx.strokeStyle = disk === this.selectedDisk ? '#ef4444' : '#374151';
        this.ctx.lineWidth = disk === this.selectedDisk ? 3 : 2;
        this.ctx.strokeRect(x, y, width, this.diskHeight);
        
        // Disk label
        this.ctx.fillStyle = 'white';
        const fontSize = Math.max(10, this.diskHeight * 0.6);
        this.ctx.font = `bold ${fontSize}px Poppins`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(disk.size.toString(), x + width / 2, y + this.diskHeight / 2 + fontSize / 3);
    }
    
    // Auto-solve functionality
    async autoSolve() {
        // Always reset the board and clear move history/queue
        this.initializeGame();
        this.userHasPlayed = false;

        this.autoSolving = true;
        
        try {
            await this.solveHanoi(this.diskCount, 0, 2, 1);
        } catch (error) {
            // Handle cancellation or errors
            console.log('Auto-solve cancelled');
        }
        
        this.autoSolving = false;
    }
    
    stopSolving() {
        this.autoSolving = false;
        this.isAnimating = false;
    }
    
    async solveHanoi(n, from, to, aux) {
        if (!this.autoSolving) throw new Error('Cancelled'); // Check if cancelled
        
        if (n === 1) {
            await this.animatedMove(from, to);
        } else {
            await this.solveHanoi(n - 1, from, aux, to);
            await this.animatedMove(from, to);
            await this.solveHanoi(n - 1, aux, to, from);
        }
    }
    
    async animatedMove(from, to) {
        return new Promise((resolve, reject) => {
            if (!this.autoSolving) {
                // If cancelled, put the disk back
                this.towers[from].push(disk);
                this.isAnimating = false;
                reject(new Error('Cancelled'));
                return;
            }
            
            if (this.towers[from].length === 0) {
                resolve();
                return;
            }
            
            this.isAnimating = true;
            
            // Remove the disk from the source tower immediately
            const disk = this.towers[from].pop();
            
            const startX = this.towerX[from];
            const endX = this.towerX[to];
            const startY = this.baseY - (this.towers[from].length + 1) * this.diskHeight;
            const liftY = this.baseY - this.towerHeight - 40;
            const endY = this.baseY - (this.towers[to].length + 1) * this.diskHeight;
            
            let phase = 0; // 0: lift, 1: move, 2: drop
            let progress = 0;
            const speed = Math.max(0.01, this.animationSpeed / 100);
            
            let currentX = startX;
            let currentY = startY;
            
            const animate = () => {
                if (!this.autoSolving) {
                    // If cancelled, put the disk back
                    this.towers[from].push(disk);
                    this.isAnimating = false;
                    reject(new Error('Cancelled'));
                    return;
                }
                
                progress += speed;
                
                if (phase === 0) { // Lifting
                    currentY = startY + (liftY - startY) * this.easeInOut(progress);
                    if (progress >= 1) {
                        currentY = liftY;
                        phase = 1;
                        progress = 0;
                    }
                } else if (phase === 1) { // Moving horizontally
                    currentX = startX + (endX - startX) * this.easeInOut(progress);
                    if (progress >= 1) {
                        currentX = endX;
                        phase = 2;
                        progress = 0;
                    }
                } else if (phase === 2) { // Dropping
                    currentY = liftY + (endY - liftY) * this.easeInOut(progress);
                    if (progress >= 1) {
                        // Complete the move by adding to destination tower
                        this.towers[to].push(disk);
                        this.moveCount++;
                        this.addMoveToHistory(from + 1, to + 1, disk);
                        this.updateDisplay();
                        
                        if (this.checkWinCondition()) {
                            this.gameWon = true;
                            this.showWinAnimation();
                        }
                        
                        this.isAnimating = false;
                        resolve();
                        return;
                    }
                }
                
                // Draw everything
                this.draw();
                
                // Draw the moving disk at its current position
                this.drawDiskAt(disk, currentX - this.getDiskWidth(disk.size) / 2, currentY);
                
                requestAnimationFrame(animate);
            };
            
            animate();
        });
    }
    
    easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    gameLoop() {
        if (this.startTime && !this.gameWon && !this.isAnimating) {
            this.updateDisplay();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
    
    // Queue-based undo functionality
    undoMove() {
        if (this.moveQueue.length === 0 || this.isAnimating || this.autoSolving || this.isStepMode) return;
        
        // Get the last move from the queue
        const lastMove = this.moveQueue.pop();
        
        // Reverse the move: move disk from 'to' back to 'from'
        const disk = this.towers[lastMove.to].pop();
        this.towers[lastMove.from].push(disk);
        
        // Update counters
        this.moveCount--;
        
        // Remove the last move from history
        this.moveHistory.pop();
        
        // Reset game won state if needed
        this.gameWon = false;
        
        // Mark that the user has played (so auto-solve will reset)
        this.userHasPlayed = true;

        // Update displays
        this.updateDisplay();
        this.updateMoveHistoryDisplay();
        this.updateUndoButton();
        this.draw();
    }
    
    // Step-by-step auto solve functionality
    generateSolutionSteps() {
        this.autoSteps = [];
        this.generateStepsRecursive(this.diskCount, 0, 2, 1);
        return this.autoSteps;
    }
    
    generateStepsRecursive(n, from, to, aux) {
        if (n === 1) {
            // For base case, show the recursion setup then immediately make the move
            this.autoSteps.push({ from, to, aux, n: 1, type: 'recursion_start' });
            this.autoSteps.push({ from, to, n: 1, type: 'move' });
        } else {
            // Show the main problem setup
            this.autoSteps.push({ from, to, aux, n, type: 'recursion_start' });
            
            // First recursive call: move n-1 disks from source to auxiliary
            this.generateStepsRecursive(n - 1, from, aux, to);
            
            // Move the largest disk from source to destination
            this.autoSteps.push({ from, to, aux, n: 1, type: 'recursion_start' });
            this.autoSteps.push({ from, to, n, type: 'move' });
            
            // Second recursive call: move n-1 disks from auxiliary to destination
            this.generateStepsRecursive(n - 1, aux, to, from);
            
            // End of this recursion level
            this.autoSteps.push({ from, to, aux, n, type: 'recursion_end' });
        }
    }
    
    startStepMode() {
        // Always reset the board and clear move history/queue
        this.initializeGame();
        this.userHasPlayed = false;

        this.isStepMode = true;
        this.generateSolutionSteps();
        this.currentStepIndex = 0;
        this.updateAutoSolveButtons();
        this.updateStepDisplay();
    }
    
    nextStep() {
        if (!this.isStepMode || this.currentStepIndex >= this.autoSteps.length) return;
        
        const step = this.autoSteps[this.currentStepIndex];
        
        if (step.type === 'move') {
            // Hide any previous recursion overlay before making the move
            this.hideRecursionOverlay();
            this._executeMove(step.from, step.to, false);
        } else if (step.type === 'recursion_start') {
            this.showRecursionOverlay(step);
        } else if (step.type === 'recursion_end') {
            this.hideRecursionOverlay();
        }
        
        this.currentStepIndex++;
        this.updateStepDisplay();
    }
    
    previousStep() {
        if (!this.isStepMode || this.currentStepIndex <= 0) return;
        
        this.currentStepIndex--;
        
        // If we're going back to a move, undo it
        const step = this.autoSteps[this.currentStepIndex];
        if (step.type === 'move') {
            // Hide any recursion overlay before undoing the move
            this.hideRecursionOverlay();
            // Reverse the move
            this._executeMove(step.to, step.from, false);
            this.moveCount -= 2; // Subtract 2 because _executeMove adds 1
        } else if (step.type === 'recursion_start') {
            // Show the recursion overlay for this step
            this.showRecursionOverlay(step);
        } else if (step.type === 'recursion_end') {
            // Find and show the corresponding start recursion overlay
            const startStep = this.findCorrespondingStart(this.currentStepIndex);
            if (startStep) {
                this.showRecursionOverlay(startStep);
            } else {
                this.hideRecursionOverlay();
            }
        }
        
        this.updateStepDisplay();
    }
    
    findCorrespondingStart(endIndex) {
        let depth = 1;
        for (let i = endIndex - 1; i >= 0; i--) {
            const step = this.autoSteps[i];
            if (step.type === 'recursion_end') depth++;
            else if (step.type === 'recursion_start') {
                depth--;
                if (depth === 0) return step;
            }
        }
        return null;
    }
    
    stopStepMode() {
        this.isStepMode = false;
        this.autoSteps = [];
        this.currentStepIndex = 0;
        this.hideRecursionOverlay();
        this.updateAutoSolveButtons();
    }
    
    showRecursionOverlay(step) {
        this.recursionHighlight.active = true;
        this.recursionHighlight.from = step.from;
        this.recursionHighlight.to = step.to;
        this.recursionHighlight.aux = step.aux;
        this.recursionHighlight.n = step.n;
        
        if (step.n === 1) {
            this.recursionHighlight.message = `T(1): Base case - Move 1 disk directly`;
        } else {
            this.recursionHighlight.message = `T(${step.n}): Solving ${step.n} disks from Tower ${step.from + 1} to Tower ${step.to + 1}`;
        }
        
        this.draw();
    }
    
    hideRecursionOverlay() {
        this.recursionHighlight.active = false;
        this.recursionHighlight.message = '';
        this.draw();
    }
    
    updateStepDisplay() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.disabled = this.currentStepIndex <= 0;
        if (nextBtn) nextBtn.disabled = this.currentStepIndex >= this.autoSteps.length;
    }
    
    updateAutoSolveButtons() {
        const startBtn = document.getElementById('startAutoSolveBtn');
        const controls = document.getElementById('autoSolveControls');
        
        if (this.isStepMode) {
            if (startBtn) startBtn.classList.add('hidden');
            if (controls) controls.classList.remove('hidden');
        } else {
            if (startBtn) startBtn.classList.remove('hidden');
            if (controls) controls.classList.add('hidden');
        }
        
        // Update undo button state
        this.updateUndoButton();
    }
    
    drawRecursionIndicator(towerIndex, canvasWidth, canvasHeight) {
        const x = this.towerX[towerIndex];
        const y = this.baseY - this.towerHeight - 50;
        
        let label = '';
        let color = '';
        
        if (towerIndex === this.recursionHighlight.from) {
            label = 'FROM';
            color = '#f59e0b';
        } else if (towerIndex === this.recursionHighlight.to) {
            label = 'TO';
            color = '#10b981';
        } else if (towerIndex === this.recursionHighlight.aux) {
            label = 'AUX';
            color = '#8b5cf6';
        }
        
        if (label) {
            // Draw indicator box
            const boxWidth = 40;
            const boxHeight = 20;
            
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x - boxWidth/2, y - boxHeight/2, boxWidth, boxHeight);
            
            // Draw border
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x - boxWidth/2, y - boxHeight/2, boxWidth, boxHeight);
            
            // Draw label
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = `bold ${Math.max(10, canvasWidth * 0.015)}px Poppins`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(label, x, y + 4);
        }
        
        // Draw recursion message if this is the active step
        if (this.recursionHighlight.message && towerIndex === 1) { // Show message above middle tower
            this.ctx.fillStyle = 'rgba(139, 92, 246, 0.9)';
            this.ctx.font = `${Math.max(12, canvasWidth * 0.018)}px Poppins`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.recursionHighlight.message, x, y - 30);
        }
    }
}

// Global game instance
let game;

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    game = new TowerOfHanoi();
});

// Floating Panel Controls
document.addEventListener('DOMContentLoaded', function() {
    // Initialize game
    game = new TowerOfHanoi();
    
    // Info panel
    const infoButton = document.getElementById('infoButton');
    const infoPanel = document.getElementById('infoPanel');
    const infoPanelClose = document.getElementById('infoPanelClose');
    
    // Panel toggle function
    function togglePanel(panel, button) {
        const isActive = panel.classList.contains('active');
        // Toggle current panel
        if (isActive) {
            panel.classList.remove('active');
        } else {
            panel.classList.add('active');
            button.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                button.style.transform = '';
            }, 300);
        }
    }
    
    // Info panel events
    if (infoButton && infoPanel && infoPanelClose) {
        infoButton.addEventListener('click', function() {
            togglePanel(infoPanel, infoButton);
        });
        
        infoPanelClose.addEventListener('click', function() {
            infoPanel.classList.remove('active');
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', function(event) {
            if (!infoPanel.contains(event.target) && 
                !infoButton.contains(event.target) && 
                infoPanel.classList.contains('active')) {
                infoPanel.classList.remove('active');
            }
        });
    }
});

// Control functions
function updateDiskCount() {
    const slider = document.getElementById('diskCountSlider');
    const value = parseInt(slider.value);
    document.getElementById('diskCountValue').textContent = value;
    
    game.diskCount = value;
    game.initializeGame();
}

function resetGame() {
    if (game.isStepMode) {
        game.stopStepMode();
    }
    game.stopSolving(); // Stop any ongoing solving
    game.initializeGame();
}

function undoMove() {
    game.undoMove();
}

function startAutoSolve() {
    game.startStepMode();
}

function nextStep() {
    game.nextStep();
}

function previousStep() {
    game.previousStep();
}

function stopAutoSolve() {
    game.stopStepMode();
}

function loadExample(diskCount) {
    game.diskCount = diskCount;
    document.getElementById('diskCountSlider').value = diskCount;
    document.getElementById('diskCountValue').textContent = diskCount;
    
    game.initializeGame();
    
    // Auto-solve after a short delay
    setTimeout(() => {
        game.autoSolve();
    }, 1000);
}

function executeCommand() {
    const input = document.getElementById('commandInput');
    const command = input.value.trim().toLowerCase();
    
    if (handleCommand(command)) {
        input.value = '';
    }
}

function handleCommandInput(event) {
    if (event.key === 'Enter') {
        executeCommand();
    }
}

function handleCommand(command) {
    // Parse various command formats
    let match;
    
    // Format: "move 1 to 3", "1 to 3", "1→3"
    match = command.match(/(?:move\s+)?(\d)\s*(?:to|→)\s*(\d)/);
    if (match) {
        const from = parseInt(match[1]) - 1;
        const to = parseInt(match[2]) - 1;
        
        if (from >= 0 && from < 3 && to >= 0 && to < 3) {
            return game.makeMove(from, to);
        }
    }
    
    // Format: "reset", "hint", "solve"
    if (command === 'reset' || command === 'r') {
        resetGame();
        return true;
    }
    
    if (command === 'hint' || command === 'h') {
        // showHint();
        return true;
    }
    
    if (command === 'solve' || command === 'auto') {
        toggleAutoSolve();
        return true;
    }
    
    return false;
}