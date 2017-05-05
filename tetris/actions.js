(function(App) {

    var instance,
        shapeInstance;

    App.Actions = function(strategy) {

        var self = this;

        this.strategy = strategy;

        this.createStage = function(nextState) {

            App.Stage.create();

            nextState();
        },

        this.createShape = function(nextState) {

            var matrix = App.matrices[Math.floor(Math.random() * App.matrices.length)];

            shapeInstance = new App.Shape(matrix);

            App.Stage.domElement.appendChild(shapeInstance.domElement);

            nextState();
        },

        this.stepDown = function(nextState) {

            shapeInstance.stepDown(nextState);
        },

        this.checkCollide = function(nextState) {

            var stageTopPointsInfo = App.Stage.topPointsInfo;

            App.Stage.checkCollideWithShape(shapeInstance.units, shapeInstance.shapePosition, nextState);
        },

        this.checkCollideCallback = function(nextState, isCollided) {

            var nextAction = isCollided ? 'mergeShapeAndStage' : 'stepDown';

            self.fire(nextAction);

        },

        this.mergeShapeAndStage = function(nextState, data) {

            App.Stage.mergeShapeAndStage(shapeInstance.units);
            shapeInstance.destroy();
            shapeInstance = null;

            nextState();

        },

        this.rotateKeyHandler = function() {

            shapeInstance.rotateKeyHandler();

            var disposition = App.Stage.checkCapacity(shapeInstance.units, shapeInstance.shapePosition, 0);
            
            if (disposition != null) {


                shapeInstance.confirmRotation();
                shapeInstance.moveShape(disposition);
            
            } else {

                shapeInstance.rotateBack();
            }
        },

        this.goFast = function() {

            shapeInstance.goFast();
        },

        this.moveHorizontal = function(direction) {

            if (App.Stage.checkHorizontalCollision(shapeInstance.units, shapeInstance.shapePosition, direction)) {

                shapeInstance.moveShape(direction);
            }

        },


        this.goSlow = function(nextState, data) {

            shapeInstance.goSlow(nextState);
        },

        this.emptyAction = function() {}


        this.fire = function(state, data) {

            var stateItem = self.strategy[state];

            if (stateItem.hasOwnProperty('onComplete')) {

                new Promise(function(resolve, reject) {

                    self[stateItem.action](resolve, data);

                }).then(function(data) {

                    self.fire(stateItem.onComplete, data);
                })
            } else {

                self[stateItem.action](data);
            }


        }
    }

    App.Actions.getInstance = function(strategy) {
        
        if (!instance) {
            
            instance = this.createInstance(strategy);
        }
        
        return instance;
    }


    App.Actions.createInstance = function(strategy) {
        
        var object = new App.Actions(strategy);
        
        return object;
    }

})(Tetris);