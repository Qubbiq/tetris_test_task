var Tetris = {

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

    fast: 100,
    slow: 800,
    unitSize: 20,
    stageSize: {
        x: 10,
        y: 20
    },

    run: function() {

        var Strategy = this.Strategy,
            Actions = this.Actions.getInstance(Strategy);

        Actions.fire('createStage');
        this.Keyboard();
    }

};