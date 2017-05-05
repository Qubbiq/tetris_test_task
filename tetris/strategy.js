(function(App) {

    App.Strategy = {

        createStage: {

            action: 'createStage',
            onComplete: 'createShape'
        },

        createShape: {

            action: 'createShape',
            onComplete: 'stepDown'
        },

        stepDown: {

            action: 'stepDown',
            onComplete: 'checkCollide'
        },

        checkCollide: {

            action: 'checkCollide',
            onComplete: 'checkCollideCallback'
        },

        checkCollideCallback: {

            action: 'checkCollideCallback',
            onComplete: 'emptyAction'
        },

        mergeShapeAndStage: {

            action: 'mergeShapeAndStage',
            onComplete: 'createShape'
        },

        checkFullLines: {

            action: 'checkFullLines',
            onComplete: 'createShape'
        }
    }



})(Tetris);