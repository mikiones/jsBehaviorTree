let bt = require("./BT");

bt.debug = true;

let testf = function (a,m) {return $SUCCESS;};

let sel = {$seq:[bt.$SUCCESS,"creep.move"]};

let subTree = {
	$des:"subree",
	$sel:[{$des:"named node",$node:{$des:"named node inner",$node:sel}}, bt.$SUCCESS]
}

let t = {
	$des:"trunk",
	$if:subTree,
	$then:{$seq:[bt.$SUCCESS,{$des:"sel1", $sel:[bt.$FAILURE,"done", testf]}, {$des:"inverting",$inv:subTree},() => $RUNNING]},
	$act: {
		done:function(actor, memory) {
			return bt.$SUCCESS;
		},
		creep:{
			move:function (c,m) {
				return bt.$SUCCESS;
			}
		}
	}
};



bt.runBt({},{},t);
