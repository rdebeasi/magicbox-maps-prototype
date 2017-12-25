/**
 * Combines all vectors for clicked admins
 * @param  {Object} admin_index
 * @param  {Object} matrix
 * @param  {Object} selected_admins
 * @return {Array} diagonal
 */
export function combine_vectors(admin_index, matrix, selected_admins) {
  let arys = Object.keys(selected_admins).map(admin_id => {
    let admin_id_index = admin_index[admin_id]
    let values = matrix[admin_index[admin_id]] || []
    // Remove diagonal value for root admin
    if (values.length > 1) {
      values[admin_id_index] = 0;
    }
    return values
  })
  console.log(arys.length, arys)
  return arys[0].map((_, i) =>
    // sum elements at the same index in array of arrays into a single array
    arys.reduce((p, item, j) => p + (arys[j][i] || 0), 0));
}

/**
 * Returns score between 0 and 1
 * @param  {Object} matrix
 * @return {Array} diagonal
 */
export function get_diagonal(matrix) {
  let mmm = matrix.reduce((a, e, i) => {
    a[i] = matrix[i][i] || 0
    // console.log(a.length,i, matrix[i][i], '****')
    return a
  }, []);
  console.log(mmm, 'mmx')
  return mmm
}

/**
 * Returns score between 0 and 1
 * @param  {Integer} mobility
 * @param  {Integer} lookup
 * @return {Object} matrix
 */
export function getMatrix(mobility, lookup) {
  // var hash = {};
  let hw = Object.keys(lookup).length;
  let matrix = mobility.reduce((ary, row, i) => {
    if (Array.isArray(ary[lookup[row.id_origin]])) {
      ary[lookup[row.id_origin]][lookup[row.id_destination]] =
      parseInt(row.people)
    } else {
      ary[lookup[row.id_origin]] = new Array(hw);
      ary[lookup[row.id_origin]][lookup[row.id_destination]] =
      parseInt(row.people)
    }

    return ary
  }, Array(hw))
  return matrix
}

/**
 * Returns array of scores between 0 and 1
 * @param  {Array} ary
 * @return {Boolean} score
 */
export function get_scores(ary) {
  if (ary.length < 1) {
    return []
  }
  let max = ary.reduce(function(a, b) {
    return Math.max(a, b);
  });
  let min = ary.reduce(function(a, b) {
    return Math.min(a, b);
  });

  return ary.map(function(e) {
    return score(min, max, parseInt(e))
  })
}

/**
 * Returns score between 0 and 1
 * @param  {Integer} min
 * @param  {Integer} max
 * @param  {Integer} number
 * @return {boolean} score
 */
function score(min, max, number) {
  let score_min = min
  let score_max = max
  let low_bound = 0
  let top_bound = 1
  return (number - score_min) / (score_max - score_min) *
  (top_bound - low_bound) + low_bound
}
