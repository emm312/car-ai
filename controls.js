class Controls {
    constructor(type) {
        this.foward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        switch (type) {
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.foward = true;
                break;
        }
        
    }

    #addKeyboardListeners() {
        document.onkeydown=(event)=> {
            switch(event.key) {
                case 'w':
                    this.foward = true;
                    break;
                case 'a':
                    this.left = true;
                    break;
                case 'd':
                    this.right = true;
                    break;
                case 's':
                    this.reverse = true;
                    break;
            }
        }
        document.onkeyup=(event)=> {
            switch(event.key) {
                case 'w':
                    this.foward = false;
                    break;
                case 'a':
                    this.left = false;
                    break;
                case 'd':
                    this.right = false;
                    break;
                case 's':
                    this.reverse = false;
                    break;
            }
        }
    }
}