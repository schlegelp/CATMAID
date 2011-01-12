<?php

include_once( 'errors.inc.php' );
include_once( 'db.pg.class.php' );
include_once( 'session.class.php' );
include_once( 'tools.inc.php' );
include_once( 'json.inc.php' );

$db =& getDB();
$ses =& getSession();

$pid = isset( $_REQUEST[ 'pid' ] ) ? intval( $_REQUEST[ 'pid' ] ) : 0;
$uid = $ses->isSessionValid() ? $ses->getId() : 0;


if ( $pid )
{
	if ( $uid )
	{

		$nid = $db->getClassId( $pid, "neuron" );
		$sid = $db->getClassId( $pid, "synapse" );
		$skid = $db->getClassId( $pid, "skeleton" );
    $pret = $db->getClassId( $pid, "presynaptic terminal" );
    $postt = $db->getClassId( $pid, "postsynaptic terminal" );
		
		$proj_usersdb = $db->getResult('SELECT COUNT(DISTINCT "ci"."user_id") AS "nr" FROM "class_instance"
									AS "ci" WHERE "ci"."project_id" = '.$pid);
		$proj_users = !empty($proj_usersdb) ? $proj_usersdb[0]['nr'] : 0;
		
		$proj_neuronsdb = $db->getResult('SELECT COUNT(DISTINCT "ci"."id") AS "nr" FROM "class_instance"
			AS "ci" WHERE "ci"."project_id" = '.$pid.' AND "ci"."class_id" = '.$nid);
		$proj_neurons = !empty($proj_neuronsdb) ? $proj_neuronsdb[0]['nr'] : 0;

		$proj_synapsesdb = $db->getResult('SELECT COUNT(DISTINCT "ci"."id") AS "nr" FROM "class_instance"
			AS "ci" WHERE "ci"."project_id" = '.$pid.' AND "ci"."class_id" = '.$sid);
		$proj_synapses = !empty($proj_synapsesdb) ? $proj_synapsesdb[0]['nr'] : 0;
		
		$proj_treenodesdb = $db->getResult('SELECT COUNT(DISTINCT "tn"."id") AS "nr" FROM "treenode" 
			AS "tn" WHERE "tn"."project_id" = '.$pid);
		$proj_treenodes = !empty($proj_treenodesdb) ? $proj_treenodesdb[0]['nr'] : 0;
		
		$proj_skeletonsdb = $db->getResult('SELECT COUNT(DISTINCT "ci"."id") AS "nr" FROM "class_instance"
			AS "ci" WHERE "ci"."project_id" = '.$pid.' AND "ci"."class_id" = '.$skid);
		$proj_skeletons = !empty($proj_skeletonsdb) ? $proj_skeletonsdb[0]['nr'] : 0;
		
    $proj_presyndb = $db->getResult('SELECT COUNT(DISTINCT "ci"."id") AS "nr" FROM "class_instance"
      AS "ci" WHERE "ci"."project_id" = '.$pid.' AND "ci"."class_id" = '.$pret);
    $proj_presyn = !empty($proj_presyndb) ? $proj_presyndb[0]['nr'] : 0;

    $proj_postsyndb = $db->getResult('SELECT COUNT(DISTINCT "ci"."id") AS "nr" FROM "class_instance"
      AS "ci" WHERE "ci"."project_id" = '.$pid.' AND "ci"."class_id" = '.$postt);
    $proj_postsyn = !empty($proj_postsyndb) ? $proj_postsyndb[0]['nr'] : 0;

		$proj_textlabelsdb = $db->getResult('SELECT COUNT(DISTINCT "tl"."id") AS "nr" FROM "textlabel"
			AS "tl" WHERE "tl"."project_id" = '.$pid.' AND NOT "tl"."deleted"');
		$proj_textlabels = !empty($proj_textlabelsdb) ? $proj_textlabelsdb[0]['nr'] : 0;
						
		echo makeJSON( array( '"proj_users"' => $proj_users,
							  '"proj_neurons"' => $proj_neurons,
							  '"proj_synapses"' => $proj_synapses,
							  '"proj_treenodes"' => $proj_treenodes,
							  '"proj_skeletons"' => $proj_skeletons,
							  '"proj_presyn"' => $proj_presyn,
							  '"proj_postsyn"' => $proj_postsyn,
							  '"proj_textlabels"' => $proj_textlabels,
			) );

	}
	else
		echo makeJSON( array( 'error' => 'You are not logged in currently.  Please log in to be able to retrieve the statistics.' ) );
}
else
	echo makeJSON( array( 'error' => 'Project closed. Can not retrieve the statistics.' ) );

?>