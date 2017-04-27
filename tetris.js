(function() {

    var ShapesConfig = {


            matrices: [

                [
                    [1, 1, 1],
                    [0, 0, 1]
                ],

                [
                    [1, 1, 1],
                    [1, 0, 0]
                ],

                [
                    [1, 1, 0],
                    [0, 1, 1]
                ],

                [
                    [0, 1, 1],
                    [1, 1, 0]
                ],

                [
                    [0, 1, 0],
                    [1, 1, 1]
                ],

                [
                    [1, 1],
                    [1, 1]
                ],

                [
                    [1, 1, 1, 1]
                ]
            ],

            colors: 7


        },
        appInstance = null,
        shapeInstance = null,
        fast = 100,
        slow = 1000,
        stepInterval = slow,
        unitSize = 20,
        stageSize = {
            x: 10,
            y: 20
        }


    function Shape(matrix) {

        this.domElement = null
        this.units = []
        this.shapePosition = {
            top: 0,
            left: 0
        }

        this.setMatrix(matrix)


        this.run()
    }

    Shape.prototype = {

        constructor: Shape,

        run: function() {

            this.rotateShapeRandomly()
            this.create()
        },

        create: function() {

            this.setShapeUnits()
            this.makeShapeDom()
            this.populateShape()
            this.keyPressListner()
        },

        setMatrix: function(matrix) {

            this.matrix = matrix
            this.endIndexH = this.matrix[0].length - 1
            this.endIndexV = this.matrix.length - 1
        },

        rotateShapeRandomly: function() {

            var times = Math.floor(Math.random() * 3)

            for (var i = 0; i <= times; i++) {

                this.rotateShapeOnce()
            }

        },

        rotateShapeOnce: function() {

            rotatedMatrix = []

            for (var x = 0; x <= this.endIndexH; x++) {

                var line = [];

                for (var y = this.endIndexV; y >= 0; y--) {

                    line.push(this.matrix[y][x]);
                }

                rotatedMatrix.push(line);
            }

            this.setMatrix(rotatedMatrix)
        },
        
        rotateKeyHandler: function() {

            var unitsWrapper = this.domElement.childNodes[0]

            unitsWrapper.innerHTML = ''
            this.rotateShapeOnce();
            this.setShapeUnits();
            this.makeShapeUnitsDom(unitsWrapper);
            this.adjustShapePosition();
        },

        adjustShapePosition: function() {

            this.shapePosition.left += Math.floor(this.matrix.length / 2 - 1)
            this.shapePosition.top += Math.floor(this.matrix[0].length / 2 - 1)

            this.updateShapePosition('left')
            this.updateShapePosition('top')

        },

        updateShapePosition: function(axis) {

            this.domElement.style[axis] = unitSize * this.shapePosition[axis] + 'px'
        },

        moveShape: function(disposition) {


            this.shapePosition.left += disposition


            if (this.shapePosition.left < 0 || this.shapePosition.left + this.matrix[0].length > stageSize.x) {

                this.shapePosition.left -= disposition
            }


            this.updateShapePosition('left')
        },

        stepDown: function(callback) {

            var self = this

            window.setTimeout(function() {

                ++self.shapePosition.top
                self.updateShapePosition('top')

                callback()

            }, stepInterval);


        },

        destroy: function() {

        },

        keyPressListner: function() {

            var self = this;

            document.onkeydown = function() {

                switch (event.keyCode) {
                    case 38:
                        self.rotateKeyHandler();
                        break;
                    case 40:
                        stepInterval = fast;
                        break;
                    case 37:
                        self.moveShape(-1);
                        break;
                    case 39:
                        self.moveShape(1);
                        break;
                }
            }

            document.onkeyup = function() {

                switch (event.keyCode) {
                    case 40:
                        stepInterval = slow;
                        break;
                }
            }
        },

        setShapeUnits: function() {

            this.units = [];

            for (var x = 0; x <= this.endIndexH; x++) {

                for (var y = 0; y <= this.endIndexV; y++) {

                    if (this.matrix[y][x] != 0) {

                        this.units.push({
                            x: x,
                            y: y
                        })
                    }
                }
            }

        },


        makeShapeDom: function() {

            var shapeContainer = document.createElement('div'),
                unitsWrapper = document.createElement('div')

            this.makeShapeUnitsDom(unitsWrapper)

            shapeContainer.appendChild(unitsWrapper);
            shapeContainer.className = 'shapeContainer';

            this.domElement = shapeContainer;
        },

        makeShapeUnitsDom: function(container) {

            for (var i in this.units) {

                var shapeUnit = document.createElement('div');
                shapeUnit.style.left = this.units[i].x * unitSize + 'px';
                shapeUnit.style.top = this.units[i].y * unitSize + 'px';
                container.appendChild(shapeUnit);
            }
        },

        populateShape: function() {

            this.shapePosition.left = parseInt(stageSize.x / 2 - this.matrix[0].length / 2)
            this.shapePosition.top = this.matrix.length * (-1)

            this.updateShapePosition('top')
            this.updateShapePosition('left')

        },

        checkCollideWithStage: function(reliefMatrix, callback) {

            console.log('checkCollideWithStage')

            callback('collided')
        }


    }

    var Stage = {

        domElement: null,

        stageReliefMatrix: {},

        create: function() {

            this.makeLayout()



            console.log('Stage Created')
        },

        rebuildRelief: function() {

        },

        makeLayout: function() {

            var stageContainer = document.createElement('div');

            stageContainer.id = 'stageContainer';
            stageContainer.style.width = unitSize * stageSize.x + 'px'
            stageContainer.style.height = unitSize * stageSize.y + 'px'

            document.getElementById('root').appendChild(stageContainer)

            this.domElement = stageContainer;

        }


    }

    function AppStrategy() {


        var self = this;

        this.actions = {

            createStage: function(nextState) {

                Stage.create()

                nextState()
            },

            createShape: function(nextState) {

                var matrix = ShapesConfig.matrices[Math.floor(Math.random() * ShapesConfig.matrices.length)];

                shapeInstance = new Shape(matrix)

                Stage.domElement.appendChild(shapeInstance.domElement)

                nextState()
            },

            stepDown: function(nextState) {

                shapeInstance.stepDown(nextState)
            },

            checkCollide: function(nextState) {

                var stageReliefMatrix = Stage.relief;

                shapeInstance.checkCollideWithStage(stageReliefMatrix, nextState)
            },

            setState: function(nextState, data) {

                console.log(data)
                nextState()
            }
        }

        this.states = {

            createStage: {

                action: self.actions.createStage,
                onComplete: 'createShape'


            },

            createShape: {

                action: self.actions.createShape,
                onComplete: 'stepDown'

            },

            stepDown: {

                action: self.actions.stepDown,
                onComplete: 'checkCollide'

            },

            checkCollide: {

                action: self.actions.checkCollide,
                onComplete: 'setState'


            },

            setState: {

                action: self.actions.setState,
                onComplete: 'stepDown'


            }
        }




        this.fireAction = function(state, data) {

            var stateItem = self.states[state]

            new Promise(function(resolve, reject) {

                stateItem.action(resolve, data)

            }).then(function(data) {

                self.fireAction(stateItem.onComplete, data)
            })
        }
    }




    var App = new AppStrategy();

    document.addEventListener("DOMContentLoaded", function() {

        App.fireAction('createStage')

    });


})()