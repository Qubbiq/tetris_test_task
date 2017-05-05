(function(App) {
	
	App.Shape = function(matrix) {

        this.domElement = null;
        this.units = [];
        this.lengthH = 0;
        this.lengthV = 0;
        this.endIndexH = 0;
        this.endIndexV = 0;
        this.shapePosition = {
            top: 0,
            left: 0
        };

        this.setMatrix(matrix);
		this.run();
    }

    App.Shape.prototype = {

        constructor: App.Shape,

        run: function() {

            this.stepInterval = App.slow;
            this.rotateShapeRandomly();
            this.create();
        },

        create: function() {

            this.setShapeUnits();
            this.makeShapeDom();
            this.populateShape();
        },

        setMatrix: function(matrix) {

            this.matrix = matrix;
            this.lengthH = this.matrix[0].length;
            this.lengthV = this.matrix.length;
            this.endIndexH = this.lengthH - 1;
            this.endIndexV = this.lengthV - 1;
        },

        rotateShapeRandomly: function() {

            var times = Math.floor(Math.random() * 3);

            for (var i = 0; i <= times; i++) {

                this.rotateShapeOnce();
            }

        },

        rotateShapeOnce: function() {

            rotatedMatrix = [];

            for (var x = 0; x <= this.endIndexH; x++) {

                var line = [];

                for (var y = this.endIndexV; y >= 0; y--) {

                    line.push(this.matrix[y][x]);
                }

                rotatedMatrix.push(line);
            }
			
			this.setMatrix(rotatedMatrix)
        },

        rotateBack: function() {

            for (var i = 0; i <= 2; i++) {

                this.rotateShapeOnce();
            }

            this.setShapeUnits();
        },

        rotateKeyHandler: function() {
			
			this.rotateShapeOnce();
            this.setShapeUnits();
		},

        confirmRotation: function() {

            this.adjustShapePosition();
            var unitsWrapper = this.domElement.childNodes[0];
            unitsWrapper.innerHTML = '';
            this.makeShapeUnitsDom(unitsWrapper);

            this.updateShapePosition('left');
            this.updateShapePosition('top');
        },

		adjustShapePosition: function() {

            this.shapePosition.left += Math.floor(this.matrix.length / 2 - 1)
            this.shapePosition.top += Math.floor(this.matrix[0].length / 2 - 1)
		},

        updateShapePosition: function(axis) {

            this.domElement.style[axis] = App.unitSize * this.shapePosition[axis] + 'px'
        },

        moveShape: function(disposition) {

			var requestedPositionLeft = this.shapePosition.left + disposition

            if (requestedPositionLeft >= 0 && requestedPositionLeft + this.matrix[0].length <= App.stageSize.x) {

                this.shapePosition.left = requestedPositionLeft
				this.updateShapePosition('left')
            }
		},

        stepDown: function(callback) {

            var self = this

            window.setTimeout(function() {

                ++self.shapePosition.top;
                
                self.updateShapePosition('top');
				callback();

            }, self.stepInterval);
		},

        destroy: function(shapeItem, callback) {

            this.domElement.parentNode.removeChild(this.domElement);
		},

        goFast: function() {

            this.stepInterval = App.fast;
        },

        goSlow: function() {

            this.stepInterval = App.slow;
        },

		setShapeUnits: function() {

            this.units = [];

            for (var x = 0; x <= this.endIndexH; x++) {

                for (var y = 0; y <= this.endIndexV; y++) {

                    if (this.matrix[y][x] != 0) {

                        this.units.push({
                            x: x,
                            y: y
                        });
                    }
                }
            }

        },

		makeShapeDom: function() {

            var shapeContainer = document.createElement('div'),
                unitsWrapper = document.createElement('div');

            this.makeShapeUnitsDom(unitsWrapper);

            shapeContainer.appendChild(unitsWrapper);
            shapeContainer.className = 'shapeContainer';

            this.domElement = shapeContainer;
        },

        makeShapeUnitsDom: function(container) {

            for (var i in this.units) {

                var shapeUnit = document.createElement('div');
                shapeUnit.style.left = this.units[i].x * App.unitSize + 'px';
                shapeUnit.style.top = this.units[i].y * App.unitSize + 'px';
                container.appendChild(shapeUnit);
            }
        },

        populateShape: function() {

            this.shapePosition.left = parseInt(App.stageSize.x / 2 - this.matrix[0].length / 2)
            this.shapePosition.top = this.matrix.length * (-1)
			
			this.updateShapePosition('top')
            this.updateShapePosition('left')

        },
	}

})(Tetris);