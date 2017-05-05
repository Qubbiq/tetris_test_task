(function(App) {

    App.Stage = {

        domElement: null,

        stageMatrix: [],

        create: function() {

            this.makeLayout();
            this.createStageMatrix();

        },

        createStageMatrix: function() {

            for (var y = 0; y <= App.stageSize.y - 1; y++) {

                var line = [];

                for (var x = 0; x <= App.stageSize.x - 1; x++) {

                    line.push(0);
                }

                this.stageMatrix.push(line);
            }
        },
        
        mergeShapeAndStage: function(units) {

            this.setUnits(units);
            this.setMatrix();
            this.resetDom();
            this.buildDom();
        },
        
        setUnits: function(units) {

            for (var i in units) {

                var unitTop = units[i].realTop,
                    unitLeft = units[i].realLeft;

                this.stageMatrix[unitTop][unitLeft] = 1;
            }


        },

        setMatrix: function(y, x) {

            var updatedMatrix = [];

            for (var y in this.stageMatrix) {

                var lineLength = 0;

                for (var x in this.stageMatrix[y]) {

                    if (this.stageMatrix[y][x] == 1) {

                        ++lineLength;
                    }
                }

                if (lineLength != App.stageSize.x) {

                    updatedMatrix.push(this.stageMatrix[y]);
                }
            }

            this.stageMatrix = updatedMatrix;
        },

        resetDom: function() {

            this.unitsWrapper.innerHTML = '';
        },


        buildDom: function() {

            for (var y in this.stageMatrix) {

                for (var x in this.stageMatrix[y]) {

                    if (this.stageMatrix[y][x] == 1) {
                        
                        this.createStageUnit(y, x);
                    }
                }
            }
        },

        createStageUnit: function(y, x) {

            var stageUnit = document.createElement('div');
            stageUnit.style.left = x * App.unitSize + 'px';
            stageUnit.style.bottom = y * App.unitSize + 'px';
            this.unitsWrapper.appendChild(stageUnit);
        },

        checkCollideWithShape: function(units, shapePosition, callback) {

            var isCollided = false
            
            for (var i in units) {

                var unitRealTop = units[i].realTop = App.stageSize.y - (shapePosition.top + units[i].y),
                    unitRealLeft = units[i].realLeft = (shapePosition.left + units[i].x);

                if (unitRealTop == 0 || (unitRealTop < App.stageSize.y - 1 && this.stageMatrix[unitRealTop - 1][unitRealLeft] != 0)) {

                    isCollided = true
                }
            }

            callback(isCollided)

        },

        checkCapacity: function(units, shapePosition, direction) {

            var steps = [0, -1, 1, -2, 2],
                result = this.checkHorizontalCollision(units, shapePosition, direction);
            
            if (result) {

                return direction;

            } else {

                var currentStep = steps.indexOf(direction);

                if (currentStep == steps.length - 1) {

                    return null;

                } else {

                    direction = steps[currentStep + 1];

                    return this.checkCapacity(units, shapePosition, direction);
                }
            }
        },

        checkHorizontalCollision: function(units, shapePosition, direction) {

            var result = true;

            for (var i in units) {

                var unitRealTop = App.stageSize.y - (shapePosition.top + units[i].y),
                    unitRealLeft = (shapePosition.left + units[i].x);

                if (unitRealTop <= App.stageSize.y && this.stageMatrix[unitRealTop - 1][unitRealLeft + direction] != 0) {

                    result = false;
                }
            }

            return result;
        },
        
        makeLayout: function() {

            var stageContainer = document.createElement('div'),
                unitsWrapper = document.createElement('div');

            stageContainer.id = 'stageContainer';
            unitsWrapper.id = 'unitsWrapper';
            stageContainer.style.width = App.unitSize * App.stageSize.x + 'px'
            stageContainer.style.height = App.unitSize * App.stageSize.y + 'px'

            document.getElementById('root').appendChild(stageContainer)
            stageContainer.appendChild(unitsWrapper)

            this.domElement = stageContainer;
            this.unitsWrapper = unitsWrapper;

        }
    }

})(Tetris);