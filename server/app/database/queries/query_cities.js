'use strict'

var get_favorites =
    'SELECT id, ' +
    '   city_name || \', \' || country_name AS name, ' +
    '   votes ' +
    'FROM jsao_super_cities ' +
    'ORDER BY votes DESC, name ASC';

var post_vote =
    'UPDATE jsao_super_cities ' +
    'SET votes = votes + 1 ' +
    'WHERE id = :ID';

module.exports = {
    get_favorites,
    post_vote
};