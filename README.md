# jsBehaviorTree
simple js Behaviour tree implementation takes dictonary as input where 

states:
$SUCCESS = succes node
$FAILURE = failure node
$RUNNING = running node 

opertions:
$seq: sequence takes array as input
  {
    seq:[$SUCCESS,$SUCCESS,$RUNNING]
  }
  
$sel: selector takss array as input
  {
    sel:[$FAILURE,$SUCCESS,$RUNNING]
  }
  
$node : a row node 
  {
    $des:"a succesful node",
    $node:$SUCCESS
  }

Actions:
actoins are a function wiych to takses a actor and a memory as input and return valid state 
var a = function (actor, memory) {
  return $SUCCESS
}

and can be definded inline in tree:
{
  $sel[(act,mem) => $RUNNING,$SUCCESS],
}
or as a nemed action
{
  $sel: ["action1",SUCCESS],
  $act: {
    action1:function(actor,memory) {
      return $SUCCESS;
    }
  },
}

$des: a descryption tag helps with debuging :
let tree = {
  $des:"a trunk of tree",
  $sel:[{$node:$SUCCESS,$des:"a node in tree"}],
}


if - then -else
{
  $des:"a stupid if then else tree",
  $if:$SUCCESS,
  $THEN:$RUNNING,
  $else:$FAILURE
}


