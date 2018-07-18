<?php
    header('Access-Control-Allow-Origin:*');
    require_once('holiday.php');
    $year = $_GET['year'];
    $month = $_GET['month'];
    $day = $_GET['day'];
    $hapi = new HolidayAPI\v1('77597e9f-4983-494e-a965-757be733bc29');

    if ($year == '' || $month == '' || $day == ''){
        $today = getdate();
        $year = $today['year'];
        $month = $today['mon'];
        $day = $today['mday']-1;
    } 
    $parameters = array(
        'country' => 'MX',
        'year'    => $year,
        'month'   => $month,
        'day'     => $day,
      );
    
    
    $response = $hapi->holidays($parameters);
    $json = json_encode($response);

    echo $json;
?>