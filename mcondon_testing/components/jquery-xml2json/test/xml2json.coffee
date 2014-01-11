toJson = null

# check compatibility with xml2js
if typeof module != 'undefined'
	expect = require 'expect.js'
	toJson = (xml, cb) ->
		if !xml then return cb null, xml
		require('xml2js').parseString(xml, cb)
else
	toJson = (xml, cb) -> cb(null, $.xml2json(xml))

describe 'xml2json', ->

	it 'should expose $.xml2json', ->
		expect(toJson).to.be.a('function')

	it 'should parse null', (done) ->
		toJson null, (err,res) ->
			expect(res).to.be(null)
			done()

	it 'should parse empty string', (done) ->
		toJson '', (err,res) ->
			expect(res).to.be('')
			done()

	it 'should parse attributes', (done) ->
		toJson '<test name="name" value="value"/>', (err, res) ->
			root = res.test
			expect(root).to.be.ok()
			expect(root.$.name).to.be('name')
			expect(root.$.value).to.be('value')
			done()

	it 'should parse element text content', (done) ->
		toJson '<test>content</test>', (err, res) ->
			expect(res.test).to.be('content')
			done()

	it 'should not trim text content', (done) ->
		toJson '<test> content </test>', (err,res) ->
			expect(res.test).to.be(' content ')
			done()

	it 'should parse child elements', (done) ->
		toJson '<test><child>first</child><child>second</child></test>', (err, res) ->
			root = res.test
			expect(root).to.be.ok()
			expect(root.child).to.eql(['first', 'second'])
			done()

	it 'should parse empty child elements', (done) ->
		toJson '<test><child/><child/></test>', (err,res) ->
			root = res.test
			expect(root).to.be.ok()
			expect(root.child).to.eql(['', ''])
			done()

	it 'should parse child elements with attributes', (done) ->
		toJson '<test><child name="one">first</child><child name="two">second</child></test>', (err,res)->
			root = res.test
			expect(root).to.be.ok()
			expect(root.child).to.eql([{$:{name:'one'},_:'first'}, {$:{name:'two'},_:'second'}])
			done()

	it 'should parse cdata block', (done) ->
		toJson '<test><![CDATA[cdata...]]></test>', (err,res) ->
			expect(res.test).to.be('cdata...')
			done()
