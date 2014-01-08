module.exports = {
'Inspect first choice': function (test) {
  test
    .open('http://127.0.0.1:9001/')
    .assert.visible('#introduzione')
    .click('#introduzione-button button:first-child')
    .wait('500')
    .assert.css('#scelta', 'opacity', '1')
    .assert.enabled('#go-thru-1', 'OK Is enabled!')
    .done();
}
};