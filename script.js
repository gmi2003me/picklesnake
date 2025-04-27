document.addEventListener('DOMContentLoaded', () => {
    // Get canvas and context
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Game variables
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let score = 0;
    let difficulty = "medium"; // Default difficulty
    
    // Snake variables
    let snake = [];
    let snakeLength = 1;
    let velocityX = 0;
    let velocityY = 0;
    let nextVelocityX = 0;
    let nextVelocityY = 0;
    let snakeX = 10;
    let snakeY = 10;
    
    // Food variables
    let foodX = 5;
    let foodY = 5;
    
    // Pickle bonus variables
    let pickleX = -1;
    let pickleY = -1;
    let pickleActive = false;
    let pickleTimer = 0;
    let pickleDisplayTime = 100; // How long the pickle stays on screen (in game cycles)
    let pickleChance = 0.005; // Chance of pickle appearing each game cycle
    let greenFlashTimer = 0;
    let greenFlashDuration = 10; // How long the green flash lasts
    
    // Smasher variables
    let smasherX = -1;
    let smasherY = -1;
    let smasherActive = false;
    let smasherTimer = 0;
    const smasherDuration = 10 * (1000 / 100); // 10 seconds worth of game cycles (assuming 100ms cycle)
    const smasherChance = 0.01; // Chance of smasher appearing each game cycle
    let smasherSpeed = 0.3; // How fast the smasher moves toward the snake (fraction of grid cell per cycle)
    let smasherWarningTimer = 0;
    const smasherWarningDuration = 30; // How long to flash warning before smasher appears
    
    // Game state
    let gameOver = false;
    let gameStarted = false;
    let difficultySelected = false;
    
    // Game speed (milliseconds)
    let gameSpeed = 100;
    let normalSpeed = 100; // Medium difficulty (default)
    let easySpeed = 150;   // Easy difficulty (50% slower)
    let hardSpeed = 50;    // Hard difficulty (50% faster)
    let turboSpeed = 50;
    let turboMode = false;
    
    // Background colors
    const normalBackground = '#222';
    const turboBackground = '#FF6600';
    const greenFlashBackground = '#00CC00';
    const smasherWarningBackground = '#880000';
    // Difficulty selection button styling
    const selectedButtonStyle = '#55FF55';
    const unselectedButtonStyle = '#666666';
    
    // Pickleball image for snake head
    const pickleballImg = new Image();
    pickleballImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjkwIiBmaWxsPSIjRkZFQTc1IiBzdHJva2U9IiNGRkMyMDAiIHN0cm9rZS13aWR0aD0iNSIvPjxwYXRoIGQ9Ik0xNTUgNzBRMTMwIDQwIDkwIDQwUTYwIDYwIDQ1IDEwMFE2MCAxNDAgOTAgMTYwUTEzMCAxNjAgMTU1IDEzMFExNjAgMTAwIDE1NSA3MFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIzIi8+PHBhdGggZD0iTTEyMCA2MFExMDAgODAgODAgNjBRNjAgODAgODAgMTAwUTEwMCA4MCAxMjAgMTAwUTE0MCA4MCAxMjAgNjBaIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIvPjxwYXRoIGQ9Ik0xMjAgMTIwUTEwMCAxNDAgODAgMTIwUTYwIDE0MCA4MCAxNjBRMTAwIDE0MCAxMjAgMTYwUTE0MCAxNDAgMTIwIDEyMFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+';
    
    // Red pickleball image for food
    const redPickleballImg = new Image();
    redPickleballImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjkwIiBmaWxsPSIjRkY1NTU1IiBzdHJva2U9IiNDQzAwMDAiIHN0cm9rZS13aWR0aD0iNSIvPjxwYXRoIGQ9Ik0xNTUgNzBRMTMwIDQwIDkwIDQwUTYwIDYwIDQ1IDEwMFE2MCAxNDAgOTAgMTYwUTEzMCAxNjAgMTU1IDEzMFExNjAgMTAwIDE1NSA3MFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIzIi8+PHBhdGggZD0iTTEyMCA2MFExMDAgODAgODAgNjBRNjAgODAgODAgMTAwUTEwMCA4MCAxMjAgMTAwUTE0MCA4MCAxMjAgNjBaIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIvPjxwYXRoIGQ9Ik0xMjAgMTIwUTEwMCAxNDAgODAgMTIwUTYwIDE0MCA4MCAxNjBRMTAwIDE0MCAxMjAgMTYwUTE0MCAxNDAgMTIwIDEyMFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+';
    
    // Green pickleball image for snake body
    const greenPickleballImg = new Image();
    greenPickleballImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjkwIiBmaWxsPSIjNTVGRjU1IiBzdHJva2U9IiMwMDhBMDAiIHN0cm9rZS13aWR0aD0iNSIvPjxwYXRoIGQ9Ik0xNTUgNzBRMTMwIDQwIDkwIDQwUTYwIDYwIDQ1IDEwMFE2MCAxNDAgOTAgMTYwUTEzMCAxNjAgMTU1IDEzMFExNjAgMTAwIDE1NSA3MFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIzIi8+PHBhdGggZD0iTTEyMCA2MFExMDAgODAgODAgNjBRNjAgODAgODAgMTAwUTEwMCA4MCAxMjAgMTAwUTE0MCA4MCAxMjAgNjBaIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIvPjxwYXRoIGQ9Ik0xMjAgMTIwUTEwMCAxNDAgODAgMTIwUTYwIDE0MCA4MCAxNjBRMTAwIDE0MCAxMjAgMTYwUTE0MCAxNDAgMTIwIDEyMFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+';
    
    // Pickle bonus image
    const pickleImg = new Image();
    pickleImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMzUgMTBDMjUgMTUgMjAgMzAgMzAgNTBDNDAgNzAgNDUgODUgNjUgOTBDODUgOTUgOTAgNjUgNzAgNTBDNTAgMzUgNTAgMTAgMzUgMTBaIiBmaWxsPSIjM0Q5OTQwIiBzdHJva2U9IiMwMDU1MDAiIHN0cm9rZS13aWR0aD0iMyIvPjxwYXRoIGQ9Ik00MCAyMEM0MiAyNSA0MiAzMCAzOCAzNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDA3NzAwIiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSI0NSIgY3k9IjQ1IiByPSIxIiBmaWxsPSIjMzMzIi8+PGNpcmNsZSBjeD0iNTUiIGN5PSI2MCIgcj0iMSIgZmlsbD0iIzMzMyIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iMzUiIHI9IjEiIGZpbGw9IiMzMzMiLz48Y2lyY2xlIGN4PSIzNSIgY3k9IjYwIiByPSIxIiBmaWxsPSIjMzMzIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSI3MCIgcj0iMSIgZmlsbD0iIzMzMyIvPjwvc3ZnPg==';
    
    // Smasher paddle image
    const smasherImg = new Image();
    smasherImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMzAwIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImhvbGVHcmFkIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiIGZ4PSI0MCUiIGZ5PSI0MCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzMzMiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMTEiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48IS0tIEhhbmRsZSAtLT48cmVjdCB4PSI1MCIgeT0iMTcwIiB3aWR0aD0iMjAiIGhlaWdodD0iMTIwIiByeD0iOCIgZmlsbD0iIzVFNDUzMiIgc3Ryb2tlPSIjNDQzMzIyIiBzdHJva2Utd2lkdGg9IjMiLz48IS0tIEdyaXAgd3JhcCAtLT48cmVjdCB4PSI1MiIgeT0iMTkwIiB3aWR0aD0iMTYiIGhlaWdodD0iODAiIHJ4PSI2IiBmaWxsPSIjNDQzMzIyIi8+PHJlY3QgeD0iNTYiIHk9IjIwMCIgd2lkdGg9IjgiIGhlaWdodD0iNjAiIHJ4PSI0IiBmaWxsPSIjMzMyMjExIi8+PCEtLSBQYWRkbGUgaGVhZCAtLT48ZWxsaXBzZSBjeD0iNjAiIGN5PSI5MCIgcng9IjU1IiByeT0iODUiIGZpbGw9IiNGRkU1QTgiIHN0cm9rZT0iI0U2RDA5OSIgc3Ryb2tlLXdpZHRoPSIzIi8+PCEtLSBIb2xlcyAtLT48Y2lyY2xlIGN4PSI0MCIgY3k9IjUwIiByPSI2IiBmaWxsPSJ1cmwoI2hvbGVHcmFkKSIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjYiIGZpbGw9InVybCgjaG9sZUdyYWQpIi8+PGNpcmNsZSBjeD0iODAiIGN5PSI1MCIgcj0iNiIgZmlsbD0idXJsKCNob2xlR3JhZCkiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjgwIiByPSI2IiBmaWxsPSJ1cmwoI2hvbGVHcmFkKSIvPjxjaXJjbGUgY3g9IjkwIiBjeT0iMTEwIiByPSI2IiBmaWxsPSJ1cmwoI2hvbGVHcmFkKSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iODAiIHI9IjYiIGZpbGw9InVybCgjaG9sZUdyYWQpIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSIxMTAiIHI9IjYiIGZpbGw9InVybCgjaG9sZUdyYWQpIi8+PGNpcmNsZSBjeD0iNjAiIGN5PSIxMTAiIHI9IjYiIGZpbGw9InVybCgjaG9sZUdyYWQpIi8+PGNpcmNsZSBjeD0iNjAiIGN5PSI3MCIgcj0iNiIgZmlsbD0idXJsKCNob2xlR3JhZCkiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjE0MCIgcj0iNiIgZmlsbD0idXJsKCNob2xlR3JhZCkiLz48IS0tIEVkZ2UgcmVpbmZvcmNlbWVudCAtLT48cGF0aCBkPSJNNjAgMTcwQzI1IDE1MCAxMCAxMjAgMTUgODBDMjAgNDAgMzUgMjAgNjAgMTBDODUgMjAgMTAwIDQwIDEwNSA4MEMxMTAgMTIwIDk1IDE1MCA2MCAxNzBaIiBmaWxsPSJub25lIiBzdHJva2U9IiNFNkMwODAiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PCEtLSBOZWNrIC0tPjxwYXRoIGQ9Ik00OCAxNjVDNDggMTY1IDUwIDE3NSA2MCAxNzVDNzAgMTc1IDcyIDE2NSA3MiAxNjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzVFNDUzMiIgc3Ryb2tlLXdpZHRoPSI1Ii8+PCEtLSBHcmlwIGRldGFpbHMgLS0+PHBhdGggZD0iTTUyIDE5NUw2OCAxOTVNNTIgMjE1TDY4IDIxNU01MiAyMzVMNjggMjM1TTUyIDI1NUw2OCAyNTUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIyMTEwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PCEtLSBCcmFuZCAtLT48dGV4dCB4PSI2MCIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzVFNDUzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U01BU0hFUjwvdGV4dD48L3N2Zz4=';
    
    // Flame animation variables
    let flameFrame = 0;
    const flameColors = ['#FFDD00', '#FFBB00', '#FF8800', '#FF5500', '#FF3300'];
    const flameParticles = 12; // Increased number of flame particles
    
    // Initialize game
    function initGame() {
        score = 0;
        document.getElementById('score').textContent = score;
        
        snake = [];
        snakeLength = 1;
        snakeX = 10;
        snakeY = 10;
        velocityX = 0;
        velocityY = 0;
        nextVelocityX = 0;
        nextVelocityY = 0;
        
        // Set game speed based on difficulty
        if (difficulty === "easy") {
            normalSpeed = easySpeed;
        } else if (difficulty === "medium") {
            normalSpeed = 100;
        } else if (difficulty === "hard") {
            normalSpeed = hardSpeed;
        }
        
        turboSpeed = normalSpeed / 2;
        turboMode = false;
        gameSpeed = normalSpeed;
        
        // Reset pickle variables
        pickleActive = false;
        pickleTimer = 0;
        greenFlashTimer = 0;
        
        // Reset smasher variables
        smasherActive = false;
        smasherTimer = 0;
        smasherWarningTimer = 0;
        
        spawnFood();
        gameOver = false;
        document.getElementById('gameOver').style.display = 'none';
        
        // Hide difficulty selection if visible
        document.getElementById('difficultySelection').style.display = 'none';
        
        // Start game loop
        if (!gameStarted) {
            gameStarted = true;
            gameLoop();
        }
    }
    
    // Main game loop
    function gameLoop() {
        if (gameOver) return;
        
        setTimeout(() => {
            clearCanvas();
            drawFood();
            
            // Handle pickle bonus logic
            updatePickle();
            if (pickleActive) {
                drawPickle();
            }
            
            // Handle smasher logic
            updateSmasher();
            if (smasherActive) {
                drawSmasher();
            }
            
            moveSnake();
            drawSnake();
            checkCollision();
            
            // Update flame animation frame
            if (turboMode) {
                flameFrame = (flameFrame + 1) % flameColors.length;
            }
            
            // Update green flash timer
            if (greenFlashTimer > 0) {
                greenFlashTimer--;
            }
            
            // Update smasher warning timer
            if (smasherWarningTimer > 0) {
                smasherWarningTimer--;
                if (smasherWarningTimer === 0) {
                    spawnSmasher();
                }
            }
            
            requestAnimationFrame(gameLoop);
        }, gameSpeed);
    }
    
    // Update smasher state
    function updateSmasher() {
        if (smasherActive) {
            // Move smasher toward snake head
            moveSmasherTowardSnake();
            
            // Check if timer has expired
            smasherTimer--;
            if (smasherTimer <= 0) {
                smasherActive = false;
            }
        } else if (gameStarted && snake.length > 1 && !smasherWarningTimer && Math.random() < smasherChance) {
            // Start warning before smasher appears - removed requirement for snake to be longer than 3
            smasherWarningTimer = smasherWarningDuration;
        }
    }
    
    // Spawn smasher at a position away from the snake
    function spawnSmasher() {
        let validPosition = false;
        
        while (!validPosition) {
            // Reduced minimum distance from 5 to 3 to allow earlier spawning in smaller areas
            const minDistance = 3;
            smasherX = Math.floor(Math.random() * tileCount);
            smasherY = Math.floor(Math.random() * tileCount);
            
            // Calculate distance from snake head
            const distX = Math.abs(smasherX - snakeX);
            const distY = Math.abs(smasherY - snakeY);
            const distance = Math.sqrt(distX * distX + distY * distY);
            
            if (distance >= minDistance) {
                validPosition = true;
                
                // Make sure it doesn't spawn on food or pickle
                if (smasherX === foodX && smasherY === foodY) {
                    validPosition = false;
                    continue;
                }
                
                if (pickleActive && smasherX === pickleX && smasherY === pickleY) {
                    validPosition = false;
                    continue;
                }
                
                // Check it doesn't spawn on any part of the snake
                for (let i = 0; i < snake.length; i++) {
                    if (smasherX === snake[i].x && smasherY === snake[i].y) {
                        validPosition = false;
                        break;
                    }
                }
            }
        }
        
        smasherActive = true;
        smasherTimer = smasherDuration;
    }
    
    // Move smasher toward snake head
    function moveSmasherTowardSnake() {
        if (!smasherActive) return;
        
        // Calculate direction to snake head
        const dx = snakeX - smasherX;
        const dy = snakeY - smasherY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 0.1) return; // Already very close
        
        // Normalize and apply speed
        const moveX = (dx / distance) * smasherSpeed;
        const moveY = (dy / distance) * smasherSpeed;
        
        // Update smasher position (using floating point for smooth movement)
        smasherX += moveX;
        smasherY += moveY;
    }
    
    // Draw the smasher
    function drawSmasher() {
        // Calculate screen coordinates (using floating-point for smooth motion)
        const x = Math.floor(smasherX * gridSize);
        const y = Math.floor(smasherY * gridSize);
        
        if (smasherImg.complete) {
            // Draw paddle image with slightly larger size
            ctx.drawImage(smasherImg, x - gridSize, y - gridSize, gridSize*3, gridSize*3);
        } else {
            // Fallback to a more detailed paddle shape
            // Draw paddle handle
            ctx.fillStyle = '#5E4532';
            ctx.strokeStyle = '#443322';
            ctx.lineWidth = 2;
            
            // Handle
            ctx.beginPath();
            ctx.roundRect(x + gridSize/3, y + gridSize/2, gridSize/3, gridSize*1.8, 4);
            ctx.fill();
            ctx.stroke();
            
            // Paddle head (more oval shaped)
            ctx.fillStyle = '#FFE5A8';
            ctx.strokeStyle = '#E6D099';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(x + gridSize/2, y, gridSize*0.8, gridSize*0.6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Draw some holes
            ctx.fillStyle = '#222';
            for (let i = 0; i < 6; i++) {
                const holeX = x + gridSize/2 + Math.cos(i * Math.PI/3) * gridSize*0.4;
                const holeY = y + Math.sin(i * Math.PI/3) * gridSize*0.3;
                ctx.beginPath();
                ctx.arc(holeX, holeY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Draw shadow under smasher
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x + gridSize/2, y + gridSize*1.8, gridSize, gridSize/6, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Update pickle state
    function updatePickle() {
        if (pickleActive) {
            pickleTimer--;
            if (pickleTimer <= 0) {
                pickleActive = false;
            }
        } else if (gameStarted && Math.random() < pickleChance) {
            spawnPickle();
        }
    }
    
    // Spawn a pickle at a random position
    function spawnPickle() {
        let validPosition = false;
        
        while (!validPosition) {
            pickleX = Math.floor(Math.random() * tileCount);
            pickleY = Math.floor(Math.random() * tileCount);
            
            // Check that pickle doesn't spawn on snake or food
            validPosition = true;
            
            if (pickleX === foodX && pickleY === foodY) {
                validPosition = false;
                continue;
            }
            
            for (let i = 0; i < snake.length; i++) {
                if (pickleX === snake[i].x && pickleY === snake[i].y) {
                    validPosition = false;
                    break;
                }
            }
        }
        
        pickleActive = true;
        pickleTimer = pickleDisplayTime;
    }
    
    // Draw the pickle
    function drawPickle() {
        const x = pickleX * gridSize;
        const y = pickleY * gridSize;
        
        if (pickleImg.complete) {
            ctx.drawImage(pickleImg, x, y, gridSize, gridSize);
        } else {
            // Fallback to a simple green pickle shape
            ctx.fillStyle = '#3D9940';
            ctx.beginPath();
            ctx.ellipse(x + gridSize/2, y + gridSize/2, gridSize/2, gridSize/3, Math.PI/4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#005500';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
    
    // Clear canvas
    function clearCanvas() {
        if (smasherWarningTimer > 0 && smasherWarningTimer % 4 < 2) {
            // Flash background red as warning
            ctx.fillStyle = smasherWarningBackground;
        } else if (greenFlashTimer > 0) {
            ctx.fillStyle = greenFlashBackground;
        } else {
            ctx.fillStyle = turboMode ? turboBackground : normalBackground;
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw the food
    function drawFood() {
        const x = foodX * gridSize;
        const y = foodY * gridSize;
        
        // Draw red pickleball image if loaded, otherwise fallback to a red circle
        if (redPickleballImg.complete) {
            ctx.drawImage(redPickleballImg, x, y, gridSize, gridSize);
        } else {
            // Fallback to a red circle with holes
            ctx.fillStyle = '#FF5555';
            ctx.beginPath();
            ctx.arc(x + gridSize/2, y + gridSize/2, gridSize/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#CC0000';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Add holes pattern
            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.arc(x + gridSize/2 - 3, y + gridSize/2 - 3, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + gridSize/2 + 3, y + gridSize/2 - 2, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + gridSize/2, y + gridSize/2 + 3, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Move the snake
    function moveSnake() {
        // Update current velocity
        velocityX = nextVelocityX;
        velocityY = nextVelocityY;
        
        // Update snake position
        snakeX += velocityX;
        snakeY += velocityY;
        
        // Add current position to snake array
        snake.unshift({ x: snakeX, y: snakeY });
        
        // Remove extra segments
        while (snake.length > snakeLength) {
            snake.pop();
        }
    }
    
    // Draw flames behind the snake when in turbo mode
    function drawFlames() {
        if (!turboMode || snake.length < 2) return;
        
        // Get the position of the last segment
        const lastSegment = snake[snake.length - 1];
        const x = lastSegment.x * gridSize;
        const y = lastSegment.y * gridSize;
        
        // Determine the direction of the flame (opposite to movement)
        const prevSegment = snake[snake.length - 2];
        const dirX = lastSegment.x - prevSegment.x;
        const dirY = lastSegment.y - prevSegment.y;
        
        // Create dramatic fire effect with multiple layers and particles
        for (let i = 0; i < flameParticles; i++) {
            // Larger flame size and longer trail
            const flameSize = gridSize * (1.5 - (i * 0.1));
            const maxOffset = 80; // Dramatically increased flame length
            const offset = i * (maxOffset / flameParticles);
            
            // Random variation for more dynamic flames
            const randomX = (Math.random() - 0.5) * 10;
            const randomY = (Math.random() - 0.5) * 10;
            
            // Alternating colors for more dramatic effect
            const colorIndex = (flameFrame + i) % flameColors.length;
            ctx.fillStyle = flameColors[colorIndex];
            
            ctx.beginPath();
            
            if (dirX > 0) { // Moving left, flame goes right
                ctx.moveTo(x + gridSize + offset, y + gridSize/2 + randomY);
                ctx.lineTo(x + gridSize/2, y + gridSize/2 - flameSize/2 + randomY/2);
                ctx.lineTo(x + gridSize/2, y + gridSize/2 + flameSize/2 + randomY/2);
            } else if (dirX < 0) { // Moving right, flame goes left
                ctx.moveTo(x - offset, y + gridSize/2 + randomY);
                ctx.lineTo(x + gridSize/2, y + gridSize/2 - flameSize/2 + randomY/2);
                ctx.lineTo(x + gridSize/2, y + gridSize/2 + flameSize/2 + randomY/2);
            } else if (dirY > 0) { // Moving up, flame goes down
                ctx.moveTo(x + gridSize/2 + randomX, y + gridSize + offset);
                ctx.lineTo(x + gridSize/2 - flameSize/2 + randomX/2, y + gridSize/2);
                ctx.lineTo(x + gridSize/2 + flameSize/2 + randomX/2, y + gridSize/2);
            } else if (dirY < 0) { // Moving down, flame goes up
                ctx.moveTo(x + gridSize/2 + randomX, y - offset);
                ctx.lineTo(x + gridSize/2 - flameSize/2 + randomX/2, y + gridSize/2);
                ctx.lineTo(x + gridSize/2 + flameSize/2 + randomX/2, y + gridSize/2);
            }
            
            ctx.closePath();
            ctx.fill();
        }
        
        // Add ember particles for extra effect
        for (let i = 0; i < 5; i++) {
            const emberSize = 2 + Math.random() * 3;
            let emberX, emberY;
            
            // Position the embers based on direction
            if (dirX > 0) { // Moving left, embers go right
                emberX = x + gridSize + Math.random() * 60;
                emberY = y + gridSize/2 + (Math.random() - 0.5) * 30;
            } else if (dirX < 0) { // Moving right, embers go left
                emberX = x - Math.random() * 60;
                emberY = y + gridSize/2 + (Math.random() - 0.5) * 30;
            } else if (dirY > 0) { // Moving up, embers go down
                emberX = x + gridSize/2 + (Math.random() - 0.5) * 30;
                emberY = y + gridSize + Math.random() * 60;
            } else if (dirY < 0) { // Moving down, embers go up
                emberX = x + gridSize/2 + (Math.random() - 0.5) * 30;
                emberY = y - Math.random() * 60;
            }
            
            // Draw the ember
            ctx.fillStyle = flameColors[Math.floor(Math.random() * flameColors.length)];
            ctx.beginPath();
            ctx.arc(emberX, emberY, emberSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add glow effect around the tail
        const glow = ctx.createRadialGradient(
            x + gridSize/2, 
            y + gridSize/2, 
            0, 
            x + gridSize/2, 
            y + gridSize/2, 
            gridSize * 2
        );
        glow.addColorStop(0, 'rgba(255, 100, 0, 0.4)');
        glow.addColorStop(1, 'rgba(255, 100, 0, 0)');
        
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x + gridSize/2, y + gridSize/2, gridSize * 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw the snake
    function drawSnake() {
        // Draw flames first (behind the snake)
        drawFlames();
        
        // Draw each segment
        snake.forEach((segment, index) => {
            const x = segment.x * gridSize;
            const y = segment.y * gridSize;
            
            if (index === 0) {
                // Draw head as a yellow pickleball
                if (pickleballImg.complete) {
                    ctx.drawImage(pickleballImg, x, y, gridSize, gridSize);
                } else {
                    // Fallback to a yellow circle with holes
                    ctx.fillStyle = '#FFEA75';
                    ctx.beginPath();
                    ctx.arc(x + gridSize/2, y + gridSize/2, gridSize/2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#FFC200';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    // Add holes pattern
                    ctx.fillStyle = '#222';
                    ctx.beginPath();
                    ctx.arc(x + gridSize/2 - 3, y + gridSize/2 - 3, 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(x + gridSize/2 + 3, y + gridSize/2 - 2, 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(x + gridSize/2, y + gridSize/2 + 3, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else {
                // Draw body segments as green pickleballs
                if (greenPickleballImg.complete) {
                    ctx.drawImage(greenPickleballImg, x, y, gridSize, gridSize);
                } else {
                    // Fallback to a green circle with holes
                    ctx.fillStyle = 'lime';
                    ctx.beginPath();
                    ctx.arc(x + gridSize/2, y + gridSize/2, gridSize/2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#008A00';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    // Add holes pattern
                    ctx.fillStyle = '#222';
                    ctx.beginPath();
                    ctx.arc(x + gridSize/2 - 3, y + gridSize/2 - 3, 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(x + gridSize/2 + 3, y + gridSize/2 - 2, 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(x + gridSize/2, y + gridSize/2 + 3, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        });
    }
    
    // Check for collisions
    function checkCollision() {
        // Wall collision
        if (snakeX < 0 || snakeX >= tileCount || snakeY < 0 || snakeY >= tileCount) {
            endGame();
            return;
        }
        
        // Self collision (check if head collides with any segment)
        for (let i = 1; i < snake.length; i++) {
            if (snakeX === snake[i].x && snakeY === snake[i].y) {
                endGame();
                return;
            }
        }
        
        // Smasher collision - check if smasher is close enough to the snake head
        if (smasherActive) {
            const distance = Math.sqrt(
                Math.pow(snakeX - smasherX, 2) + 
                Math.pow(snakeY - smasherY, 2)
            );
            
            // Use a smaller hitbox (0.8) than the visual size for fairness
            if (distance < 0.8) {
                endGame();
                return;
            }
        }
        
        // Food collision
        if (snakeX === foodX && snakeY === foodY) {
            snakeLength++;
            score++;
            document.getElementById('score').textContent = score;
            spawnFood();
            
            // Increase speed slightly with each food eaten, keeping turbo mode relative
            if (normalSpeed > 50) {
                normalSpeed -= 1;
                turboSpeed = normalSpeed / 2;
                gameSpeed = turboMode ? turboSpeed : normalSpeed;
            }
        }
        
        // Pickle collision
        if (pickleActive && snakeX === pickleX && snakeY === pickleY) {
            // Add 5 bonus points
            score += 5;
            document.getElementById('score').textContent = score;
            
            // Flash the field green
            greenFlashTimer = greenFlashDuration;
            
            // Deactivate the pickle
            pickleActive = false;
            
            // Play bonus sound effect (if you want to add sound later)
        }
    }
    
    // Generate new food at a random position
    function spawnFood() {
        let validPosition = false;
        
        while (!validPosition) {
            foodX = Math.floor(Math.random() * tileCount);
            foodY = Math.floor(Math.random() * tileCount);
            
            // Check if the food spawns on the snake or pickle
            validPosition = true;
            
            if (pickleActive && foodX === pickleX && foodY === pickleY) {
                validPosition = false;
                continue;
            }
            
            for (let i = 0; i < snake.length; i++) {
                if (foodX === snake[i].x && foodY === snake[i].y) {
                    validPosition = false;
                    break;
                }
            }
        }
    }
    
    // End game
    function endGame() {
        gameOver = true;
        gameStarted = false;
        difficultySelected = false;
        document.getElementById('finalScore').textContent = score;
        document.getElementById('gameOver').style.display = 'block';
    }
    
    // Toggle turbo mode
    function setTurboMode(enabled) {
        if (turboMode !== enabled) {
            turboMode = enabled;
            gameSpeed = turboMode ? turboSpeed : normalSpeed;
        }
    }
    
    // Handle keyboard input
    document.addEventListener('keydown', (e) => {
        // Only start the game after difficulty is selected
        if (!gameStarted && !gameOver && difficultySelected) {
            initGame();
        }
        
        // Toggle turbo mode with spacebar
        if (e.code === 'Space' && !turboMode) {
            setTurboMode(true);
            e.preventDefault(); // Prevent page scrolling
        }
        
        // Arrow keys
        switch (e.key) {
            case 'ArrowUp':
                if (velocityY !== 1) { // Prevent moving directly opposite current direction
                    nextVelocityX = 0;
                    nextVelocityY = -1;
                }
                break;
            case 'ArrowDown':
                if (velocityY !== -1) {
                    nextVelocityX = 0;
                    nextVelocityY = 1;
                }
                break;
            case 'ArrowLeft':
                if (velocityX !== 1) {
                    nextVelocityX = -1;
                    nextVelocityY = 0;
                }
                break;
            case 'ArrowRight':
                if (velocityX !== -1) {
                    nextVelocityX = 1;
                    nextVelocityY = 0;
                }
                break;
        }
        
        // Prevent the default behavior of arrow keys (scrolling)
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
    });
    
    // Handle key release for turbo mode
    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
            setTurboMode(false);
        }
    });
    
    // Restart button
    document.getElementById('restartButton').addEventListener('click', () => {
        // Show difficulty selection when restarting
        showDifficultySelection();
    });
    
    // Function to show difficulty selection
    function showDifficultySelection() {
        // Create difficulty selection if it doesn't exist
        if (!document.getElementById('difficultySelection')) {
            const difficultyDiv = document.createElement('div');
            difficultyDiv.id = 'difficultySelection';
            difficultyDiv.style.position = 'absolute';
            difficultyDiv.style.top = '50%';
            difficultyDiv.style.left = '50%';
            difficultyDiv.style.transform = 'translate(-50%, -50%)';
            difficultyDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            difficultyDiv.style.padding = '20px';
            difficultyDiv.style.borderRadius = '10px';
            difficultyDiv.style.color = 'white';
            difficultyDiv.style.textAlign = 'center';
            difficultyDiv.style.fontSize = '18px';
            difficultyDiv.style.zIndex = '100';
            
            // Add heading
            const heading = document.createElement('h2');
            heading.textContent = 'Select Difficulty';
            difficultyDiv.appendChild(heading);
            
            // Create button container
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'center';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.marginTop = '20px';
            
            // Create difficulty buttons
            const difficulties = ['easy', 'medium', 'hard'];
            const difficultyLabels = ['Easy', 'Medium', 'Hard'];
            
            difficulties.forEach((diff, index) => {
                const button = document.createElement('button');
                button.textContent = difficultyLabels[index];
                button.style.padding = '10px 20px';
                button.style.borderRadius = '5px';
                button.style.border = 'none';
                button.style.cursor = 'pointer';
                button.style.backgroundColor = diff === difficulty ? selectedButtonStyle : unselectedButtonStyle;
                button.style.color = 'white';
                button.style.fontSize = '16px';
                button.style.fontWeight = 'bold';
                
                button.addEventListener('click', () => {
                    // Update difficulty
                    difficulty = diff;
                    
                    // Update button styles
                    const allButtons = buttonContainer.querySelectorAll('button');
                    allButtons.forEach(btn => {
                        btn.style.backgroundColor = unselectedButtonStyle;
                    });
                    button.style.backgroundColor = selectedButtonStyle;
                });
                
                buttonContainer.appendChild(button);
            });
            
            // Create start button
            const startButton = document.createElement('button');
            startButton.textContent = 'Start Game';
            startButton.style.display = 'block';
            startButton.style.margin = '20px auto 0';
            startButton.style.padding = '10px 30px';
            startButton.style.borderRadius = '5px';
            startButton.style.border = 'none';
            startButton.style.cursor = 'pointer';
            startButton.style.backgroundColor = '#FF8800';
            startButton.style.color = 'white';
            startButton.style.fontSize = '18px';
            startButton.style.fontWeight = 'bold';
            
            startButton.addEventListener('click', () => {
                difficultySelected = true;
                initGame();
            });
            
            // Append elements
            difficultyDiv.appendChild(buttonContainer);
            difficultyDiv.appendChild(startButton);
            document.body.appendChild(difficultyDiv);
        }
        
        // Show the difficulty selection
        document.getElementById('difficultySelection').style.display = 'block';
        document.getElementById('gameOver').style.display = 'none';
    }
    
    // Draw initial screen
    clearCanvas();
    
    // Show difficulty selection on initial load
    showDifficultySelection();
    
    // Add description for difficulty levels
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Select difficulty and press Start Game', canvas.width / 2, canvas.height / 2 - 120);
    ctx.fillText('Hold SPACE for turbo mode', canvas.width / 2, canvas.height / 2 + 120);
    ctx.fillText('Collect pickles for 5 bonus points!', canvas.width / 2, canvas.height / 2 + 150);
    ctx.fillText('Beware of the Smasher paddle!', canvas.width / 2, canvas.height / 2 + 180);
}); 