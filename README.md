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
  1. `$SUCCESS` = success node
  2. `$FAILURE` = failure node
  3. `$RUNNING` = running node

nodes:
1. `$seq`: sequence takes array of childs as input
```javascript
    var tree = {
      $seq:[$SUCCESS,$SUCCESS,$RUNNING]
    } // will eval to $RUNNING (sequnce is running until faiure or running
```
2. `$sel`: selector takss array as input
```javascript
  var tree = {
    $sel:[$FAILURE, $SUCCESS, $RUNNING]
  } // will eval to $SUCCESS as selector chose first not failing path
```

3. `$node` : a row node
```javascript
var tree = {
    $des:"a succesful node",
    $node:$SUCCESS,
  } // will eval to $SUCCESS
```
4. `$if:$then:$else:`: when if node eval to `$SUCCESS` the $then node is evaulate otherwise if $else node is pressent eval it
```javascript
var tree = {
  $des = "a if - then - else ",
  $if:$SUCCESS,
  $then:$RUNNING,
  $else:$FAILURE,
} // will eval to $RUNNING
```
5. `$inv` invert $SUCCESS => `$FAILURE`, `$FAILURE` => `$SUCCESS`
```javascript
var tree = { 
  $inv:$SUCCESS
} // will evel to $FAILURE
```
6. Actions takes actor and memort as input and return state:
 i. Named: actions can be named by palcing them in a `$act` section of tree: 
 ``` javascript
 let tree = {
  $sel:["action"],
  $act:{
    action:function(actor, memory) {return $SUCCESS},
  }
 } // will eval to SUCCESS.
 ```
 ii. nested 
 ```javascript
  let tree = {
    $sel:["a.nested.action"],
    $act: {
      a: {
       nested:{
        action: () => $SUCCESS;
       }
      }
    }
  } // eval to $SUCCESS
 ```
 
 iii. anoumynous/inline
 ```javascript
 let tree = {
  $sel:[()=>$SUCCESS]
 } // eval to $SUCCESS
 ```

