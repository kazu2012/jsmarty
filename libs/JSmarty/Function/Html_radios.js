JSmarty.Function.Html_radios = function($params, $smarty)
{
	var $html = '', $selected = '';
	var $name, $values, $options, $separator;

	$name      = $params['name'] || '';
	$options   = $params['options'];
	$separator = $params['separator'] || '';

	if($name != '')
		$name = ' name='+ $name;

	for(var i in $options)
	{
		$selected = ($params['selected'] == i) ? ' checked' : '';

		$html +=
			'<input type="radio" value="+ i +"'+ $name + $selected +
			' />' + $options[i] + $separator;
	}

	return $html;
}