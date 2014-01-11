Package.describe({
  summary: "jQuery plugin to convert XML to JSON."
});

Package.on_use(function(api, where) {
  api.use('jquery', ['client']);
  api.add_files('./src/xml2json.js', ['client']);
});
