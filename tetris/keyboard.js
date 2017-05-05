(function(App) {
  
  App.Keyboard = function() {

        var Actions = this.Actions.getInstance();

        document.onkeydown = function() {

            switch (event.keyCode) {
                case 38:
                    Actions.rotateKeyHandler();
                    break;
                case 40:
                    Actions.goFast();
                    break;
                case 37:
                    Actions.moveHorizontal(-1);
                    break;
                case 39:
                    Actions.moveHorizontal(1);
                    break;
            }
        }

        document.onkeyup = function() {

            switch (event.keyCode) {
                case 40:
                    Actions.goSlow();
                    break;
            }
        }
    }

})(Tetris);