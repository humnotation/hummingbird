define(
[
    "lodash" 
], 
function(
    _
) {

    function FileUploadHandler($fileInput)
    {
        this.$input = $fileInput;
        this.callbacks = {};
        this._init();
    }

    _.extend(FileUploadHandler.prototype, {

        onFileLoaded: function(callback)
        {
            if(!this.callbacks.onFileLoaded)
            {
                this.callbacks.onFileLoaded = [];
            }
            this.callbacks.onFileLoaded.push(callback);
        },

        _init: function()
        {
            this.$input.change(_.bind(this._onFileSelected, this));
        },

        _onFileSelected: function()
        {
            this.reader = new FileReader();
            this.reader.onload = _.bind(this._onFileLoaded, this);
            this.reader.readAsText(this.$input[0].files[0]);
        },

        _onFileLoaded: function()
        {
            _.each(this.callbacks.onFileLoaded, function(callback)
            {
                callback(this.reader.result);
            }, this);
        }
         
    });


    return FileUploadHandler;
}); 