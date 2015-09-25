<?php
	require_once("connection.php");
	header('Content-Type: text/html; encoding=UTF-8');
	//Pass parameters from marker click
	$id = $_REQUEST['id'];
	
	if ($id == 2) {
		$v = "Υπουργείο Εθνικής Άμυνας";
	}
	if ($id == 6) {
		$v = "Υπουργείο Δικαιοσύνης, Διαφάνειας και Ανθρωπίνων Δικαιωμάτων";
	}
	if ($id == 7) {
		$v = "Υπουργείο Εξωτερικών";
	}
	if ($id == 8) {
		$v = "Υπερυπουργείο Εργασίας, Κοινωνικής Ασφάλισης και Κοινωνικής Αλληλεγγύης";
	}
	if ($id == 9) {
		$v = "Υπερυπουργείο Εσωτερικών και Διοικητικής Ανασυγκρότησης";
	}
	if ($id == 11) {
		$v = "Υπερυπουργείο Οικονομίας, Υποδομών, Ναυτιλίας και Τουρισμού";
	}
	if ($id == 12) {
		$v = "Υπουργείο Οικονομικών";
	}
	if ($id == 14) {
		$v = "Υπερυπουργείο Παραγωγικής Ανασυγκρότησης, Περιβάλλοντος και Ενέργειας";
	}
	if ($id == 15) {
		$v = "Υπερυπουργείο Πολιτισμού, Παιδείας και Θρησκευμάτων";
	}
	if ($id == 17) {
		$v = "Υπουργείο Υγείας";
	}
	if ($id == 19) {
		$v = "Α.Κ.Ε.";
	}
	if ($id == 20) {
		$v = "Α.Κ.Ε. που μετατράπηκε σε επερώτηση";
	}
	if ($id == 21) {
		$v = "Α.Κ.Ε. σε συνδιασμό με ερώτηση";
	}
	if ($id == 22) {
		$v = "Ανακοινώσεις";
	}
	if ($id == 23) {
		$v = "Αναφορές";
	}
	if ($id == 24) {
		$v = "Δελτία Τύπου";
	}
	if ($id == 25) {
		$v = "Διαρκείς Επιτροπές";
	}
	if ($id == 26) {
		$v = "Επερωτήσεις";
	}
	if ($id == 27) {
		$v = "Επίκαιρες Ερωτήσεις";
	}
	if ($id == 28) {
		$v = "Ερωτήσεις";
	}
	if ($id == 29) {
		$v = "Ερώτηση σε συνδιασμό με Α.Κ.Ε.";
	}
	if ($id == 30) {
		$v = "Τροπολογία";
	}
	if ($id == 31) {
		$v = "Άρθρα";
	}
	if ($id == 32) {
		$v = "Επιστολές";
	}
	if ($id == 33) {
		$v = "Ομιλίες – Συνεντεύξεις";
	}

	//Establish Connection
	$mySqlConnection = @mysql_connect ($db_server, $user, $pass) or die ('Error: '.mysql_error());
	mysql_set_charset('utf8',$mySqlConnection);

	mysql_select_db($database);

	// Perform insert
	$query = sprintf("UPDATE category_counter_3 SET count=count + 1 WHERE name='%s'", mysql_real_escape_string($v));

	mysql_query($query) or die(mysql_error());
?>