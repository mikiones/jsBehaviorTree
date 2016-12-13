# jsBehaviorTree
simple js Behaviour tree implementation takes dictonary as input where

Example tree
```javascript
  let simpleTree = {
    $des:"a simple tree", // descryption of this level
    $seq:[ // a seqence
      "action1", // names action in $act section
      "test.action1", // can be nested
      $SUCCESS, // can be a state
      (action,mem) => $SUCCESS, // can be a function
    ],
    $act:{ // place to define action for tree
      action1:function(actor, memory) {
        return $SUCCESS;
      },
      test: {
        action1:(actor,mem) => $FAILURE,
      }
    }
  };
  let act = {};
  let mem = {};
  // evaulate tree until finish or $RUNNING State is returnd
  BT.runBt(act,mem,simpleTree);
```

states:
  1. $SUCCESS = success node
  2. $FAILURE = failure node
  3. $RUNNING = running node

nodes:
1. $seq: sequence takes array of childs as input
```javascript
    var tree = {
      $seq:[$SUCCESS,$SUCCESS,$RUNNING]
    }
```
2. $sel: selector takss array as input
```javascript
  var tree = {
    $sel:[$FAILURE,$SUCCESS,$RUNNING]
  }
```

3. $node : a row node
```javascript
var tree = {
    $des:"a succesful node",
    $node:$SUCCESS,
  }
```

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
