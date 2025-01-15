class VirtualKeyboard {
    constructor() {
        this.layouts = {
            standard: {
                default: [
                    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
                    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
                    ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
                    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
                    ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
                ],
                shift: [
                    ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Backspace'],
                    ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|'],
                    ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Enter'],
                    ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'Shift'],
                    ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
                ]
            },
            numpad: [
                ['7', '8', '9'],
                ['4', '5', '6'],
                ['1', '2', '3'],
                ['0', '.', 'Enter']
            ]
        };
        
        this.currentLayout = 'standard';
        this.shift = false;
        this.caps = false;
        this.audio = new Audio('keypress.mp3');
        this.init();
        this.initKeyboardShortcuts();
        this.initTouchSupport();
    }

    init() {
        const keyboard = document.getElementById('keyboard');
        keyboard.innerHTML = ''; // Clear existing keyboard
        
        // Add layout switcher
        const layoutSwitch = document.createElement('div');
        layoutSwitch.className = 'layout-switch';
        layoutSwitch.innerHTML = `
            <button onclick="keyboard.switchLayout('standard')">Standard</button>
            <button onclick="keyboard.switchLayout('numpad')">Numpad</button>
        `;
        keyboard.parentElement.insertBefore(layoutSwitch, keyboard);

        // Create main keyboard
        this.createKeys(keyboard);
        
        // Create numpad if in standard layout
        if (this.currentLayout === 'standard') {
            this.createNumpad();
        }
    }

    createKeys(keyboard) {
        const layout = this.shift ? 
            this.layouts[this.currentLayout].shift : 
            this.layouts[this.currentLayout].default || this.layouts[this.currentLayout];

        layout.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';

            row.forEach(key => {
                const keyButton = this.createKeyButton(key);
                rowDiv.appendChild(keyButton);
            });

            keyboard.appendChild(rowDiv);
        });
    }

    createKeyButton(key) {
        const keyButton = document.createElement('div');
        keyButton.className = 'key';
        keyButton.dataset.key = key.toLowerCase();
        
        // Add special classes for wider keys
        if (['Space', 'Backspace', 'Enter', 'Shift', 'Caps', 'Tab'].includes(key)) {
            keyButton.classList.add('wide');
            if (key === 'Space') keyButton.classList.add('space');
        }
        
        keyButton.textContent = key;
        
        keyButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleKeyPress(key);
        });

        // Add touch events
        keyButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyButton.classList.add('active');
        });

        keyButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyButton.classList.remove('active');
            this.handleKeyPress(key);
        });

        return keyButton;
    }

    handleKeyPress(key) {
        const output = document.getElementById('output');
        this.playKeySound();

        switch(key) {
            case 'Backspace':
                output.value = output.value.slice(0, -1);
                break;
            case 'Space':
                output.value += ' ';
                break;
            case 'Enter':
                output.value += '\n';
                break;
            case 'Tab':
                output.value += '\t';
                break;
            case 'Shift':
                this.shift = !this.shift;
                this.updateKeyDisplay();
                break;
            case 'Caps':
                this.caps = !this.caps;
                this.updateKeyDisplay();
                break;
            case 'Ctrl':
            case 'Alt':
                // These keys don't produce output
                break;
            default:
                let char = key;
                if (this.shift !== this.caps) {
                    char = char.toUpperCase();
                }
                output.value += char;
                if (this.shift) {
                    this.shift = false;
                    this.updateKeyDisplay();
                }
        }
        output.focus();
    }

    playKeySound() {
        this.audio.currentTime = 0;
        this.audio.play().catch(err => console.log('Audio not loaded yet'));
    }

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            const key = document.querySelector(`[data-key="${e.key.toLowerCase()}"]`);
            if (key) {
                key.classList.add('active');
                this.handleKeyPress(key.textContent);
            }
        });

        document.addEventListener('keyup', (e) => {
            const key = document.querySelector(`[data-key="${e.key.toLowerCase()}"]`);
            if (key) {
                key.classList.remove('active');
            }
        });
    }

    initTouchSupport() {
        document.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('key')) {
                e.preventDefault();
                e.target.classList.add('active');
            }
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('key')) {
                e.preventDefault();
                e.target.classList.remove('active');
            }
        }, { passive: false });
    }

    switchLayout(layout) {
        this.currentLayout = layout;
        this.init();
    }
}

// Initialize the virtual keyboard when the page loads
let keyboard;
window.addEventListener('DOMContentLoaded', () => {
    keyboard = new VirtualKeyboard();
}); 