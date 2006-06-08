JSmarty.Function.html_select_time = function($params, $smarty)
{
	var $html = '';
	var $time , $ivals, $extras, $displays;
	var options = JSmarty.Function.html_select_time.options;

	$time     = (typeof $params['time'] == 'undefined') ? new Date() : new Date($params['time']);
	$ivals    = {hour:'',minute:'',second:''};
	$extras   = {hour:'',minute:'',second:'',meridian:'',all:''};
	$prefix   = $params['prefix'] || 'Time_';
	$displays = {hour:'',minute:'',second:''};

	for(var i in $ivals)
		$ivals[i] = $params[i+'_interval'] || 1;

	for(var i in $extras)
		$extras[i] = $params[i+'_extra'] || '';

	for(var i in $displays)
		$displays[i] = ($params['display_'+i+'s'] == (void 0)) ? true : $params['display_'+i+'s'];

	for(var i in $displays)
	{
		if(!$displays[i]) continue;
		$html +=
			'<select>'+
			options(i, '', $time, $ivals[i], $params['use_24_hours'])+
			'</select>';
	}

	$displays['meridian'] = ($params['display_meridian'] == (void 0)) ? true : $params['display_meridian'];

	if($displays['meridian'])
	{
		$html +=
			'<select>'+
			'<option value="am">am</option>'+
			'<option value="pm">pm</option>'+
			'</select>';
	}

	return $html;
}

JSmarty.Function.html_select_time.options = function($type, $extra, $time, $ival, $24)
{
	var $ckd, $num, $max, $html = '';

	switch($type)
	{
		case 'hour':
			$max = 23;
			$now = $time.getHours();
			break;
		case 'minute':
			$max = 59, $now = $time.getMinutes();
			break;
		case 'second':
			$max = 59, $now = $time.getSeconds();
			break;
	}

	$ival = $ival - 0;

	for(var i=0;i<=$max;i=i + $ival)
	{
		$num = (i >= 10) ? i : '0'+ i;
		$ckd = ($now == i) ? ' selected' : '';
		$html += '<option'+$extra+$ckd+'>'+$num+'</option>';
	}

	return $html;
}