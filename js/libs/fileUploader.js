define([
    "jquery",
    "lodash"
], function(
    $,
    _
) {


    function FileUploader(options)
    {
        if(!options || !options.input || !options.callback)
        {
            throw new Error("FileUploader requires a file input field and a callback method");
        }
        this.$input = $(options.input);
        this.options = options;
        this._init();
    }

    _.extend(FileUploader.prototype, {

        _init: function()
        {
            this.$input.on("change", _.bind(this.processFile, this));
        },

        processFile: function() {

            var file = this.$input[0].files[0];

            if(this.options.validator)
            {
                if(!this.options.validator(file))
                {
                    return;
                }
            }
            var reader = new FileReader();

            if(this.options.progress)
            {
                this.options.progress();
                reader.onprogress = this.options.progress;
            }

            if(this.options.error)
            {
                reader.onerror = this.options.error;
            }

            if(this.options.abort)
            {
                reader.onabort = this.options.onabort;
            }

            if(this.options.start)
            {
                reader.onloadstart = this.options.start;
            }

            reader.onload = _.bind(this._onLoad, this);

            // Read in the image file as a binary string.
            reader.readAsBinaryString(file);

        },

        _onLoad: function(evt)
        {
            this.options.callback(evt.target.result);
        }

    });

    return FileUploader;

});