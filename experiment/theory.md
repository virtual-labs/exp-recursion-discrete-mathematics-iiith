**Recursion** is a technique that allows us to break down a problem into one or more subproblems that are similar in form to the original problem. For example, suppose we need to add up all of the numbers in an array. We'll write a function called add_array that takes as arguments an array of numbers and a count of how many of the numbers in the array we would like to add; it will return the sum of that many numbers.

If we had a function that would add up all but the very last number in the array, then we would simply have to add the last number to that sum and we would be done. Add_array is an ideal function for adding up all but the last number (as long as the array contains at least one number). After all, add_array is responsible for taking an array and a count, and adding up that many array elements. If there are no numbers in the array, then zero is the desired answer. These observations suggest the following function:
```
int add_array(int arr[], int count) {

   if (count == 0) return 0;
   return arr[count - 1] + add_array(arr, count - 1);
}
```
This function is perfectly legal C, and it operates correctly. Notice that the function has two components:
- a base case, represented by the if and the return 0, in which the function does not call itself. This handles the case where there are no numbers to add.
- a recursive case that breaks the problem down into a smaller version of the original problem together with an addition. In the recursive case, add_array is used to add together count-1 items; the count-th item is then added to this result (remember that the n-th item of an array is stored at position n-1).

The call to add_array from inside add_array is called a recursive call.

#### Example: The Factorial Function
One of the classic examples of recursion is the factorial function. Although factorial is not the world's most interesting function, it will provide us with many useful observations.

Recall that factorial, which is written n!, has the following definition:

   n! = 1 * 2 * 3 * .... * (n-2) * (n-1) * n
We can use this definition to write a C function that implements factorial:

```
int fact(int n) {
   int i;
   int result;
  
   result = 1;
   for (i = 1; i <= n; i++) {
      result = result * i;
   }
   return result;
}
```

This is a simple iterative function that mirrors the definition of factorial. We can derive a different definition for factorial by noticing that n! = n * (n-1)! and 1! = 1. For example, 4! = 4 * 3!. Notice that we need to specify a value for 1! because our definition does not apply when n=1. This kind of definition is known as an inductive definition, because it defines a function in terms of itself.
We can write a C function that mirrors this new definition of factorial as follows:

```
int fact(int n) {

   if (n == 1) return 1;

    return n * fact(n - 1);
}
```

Notice that this function precisely follows our new definition of factorial. It is recursive, because it contains a call to itself.
Let's compare the two versions:

- The iterative version has two local variables; the recursive version has none.
- The iterative version has three statements; the recursive version has one.
- The iterative version must save the solution in an intermediate variable before it can be returned; the recursive version calculates and returns its result as a single expression.
Recursion simplifies the fact function! It does so by making the computer do more work, so that you can do less work.

#### Writing Recursive Functions
To successfully apply recursion to a problem, you must be able to break the problem down into subparts, at least one of which is similar in form to the original problem. For example, suppose we want to count the number of occurrences of the number 42 in an array of n integers. The first thing we should do is write the header for our function; this will ensure that we know what the function is supposed to do and how it is called:

int count_42s(int array[], int n);
To use recursion on this problem, we must find a way to break the problem down into subproblems, at least one of which is similar in form to the original problem. If we know that the array contains n numbers, we might break our task into the subproblems of:
- counting the number of times that 42 appears in the first n-1 elements of the array (this is a subproblem that is similar in form to the original problem);
- counting the number of times that 42 appears in the n-th element of the array (i.e. determining whether the n-th element is 42); and
- adding these two sums together and returning the result.
Part 1 of this decomposition suggests the following recursive call:
count_42s(array, n-1);
If successful, this recursive call will count all of the occurrences of the number 42 in the first n-1 positions of the array and return the sum (we will discuss the conditions that must hold for a recursive call to be successful in the Section 5; until then, we will assume that all recursive calls work properly). We must now determine how to use this result. If the last element in the array is not 42, then the number of 42s in the entire array is the same as the number of 42s in all but the last element of the array. If the last number in the array is 42, then the number of 42s in the entire array is one more than the number found in the subarray. This suggests the following code:

```
   if (array[n-1] != 42) {
      return count_42s(array, n-1);
   }
   return 1 + count_42s(array, n-1);
```

Here we have two recursive calls (only one of which will actually be used in any given situation). We must now determine whether there are any circumstances under which this code will not work. In fact, this code will not work when n==0; in such a case it tries to subscript the array with -1, which is not a legal array subscript in C. (Oh alright, it's legal; it's just that it's almost never what you want, and will often lead to a segmentation fault or worse.) That means that unless we treat specially the case where n is zero, our function will not work when asked to count the number of 42s in an array of zero items. We will therefore add a base case that will test for n==0 and return zero as its result in that case. This gives the function:

```
int count_42s(int array[], int n) {

   if (n==0) return 0;
   if (array[n-1] != 42) {
      return count_42s(array, n-1);
   }
   return 1 + count_42s(array, n-1);
}
```

This is a perfectly good recursive solution to the count_42s problem. It is not the only recursive solution though; there are other ways to break the problem into subpieces. For example, we could break the array into two pieces of equal size, count the number of 42s in each half, then add the two sums. To do this, we will need to hand as arguments to count_42s not just the array and the subscript of the highest value in the array, but also the subscript of the lowest value in the array:
int count_42s(int array[], int low, int high);
A call such as count_42s(my_array, A, B) says "count all the occurrences of the number 42 in my_array that lie between position A and position B inclusive."
We can calculate the midpoint between subscript low and subscript high with (high+low)/2. Thus we can count the number of 42s in each half of the array and add them together with:

  - count_42s(array, low, (low + high) / 2) +
      count_42s(array, (low + high) / 2 + 1, high);

We now have a recursive case but no base case. When will the recursive case fail? It fails when the array does not contain at least two numbers. If the array contains no items, or it contains one item that is not 42, then we should return zero. If the array contains exactly one number, and that number is 42, then we should return one. Putting it all together, we get:

```
int count_42s(int array[], int low, int high) {
   if ((low > high) ||
       (low == high && array[low] != 42)) {
      return 0 ;
   }
   if (low == high && array[low] == 42) {
      return 1;
   }
   return count_42s(array, low, (low + high)/2) + 
         count_42s(array, 1 + (low + high)/2, high));
}
```

Note that the line

  -  if (low == high && array[low] == 42)

could properly be written simply as if (low==high). The comparison with 42 is included here simply to make each of the relevant conditions explicit in the same expression.

These examples demonstrate that there may be many ways to break a problem down into subproblems such that recursion is useful. It is up to you the programmer to determine which decomposition is best. The general approach to writing a recursive program is to:

- write the function header so that you are sure what the function will do and how it will be called;
- decompose the problem into subproblems;
- write recursive calls to solve those subproblems whose form is similar to that of the original problem;
- write code to combine, augment, or modify the results of the recursive call(s) if necessary to construct the desired return value or create the desired side--effects; and
- write base case(s) to handle any situations that are not handled properly by the recursive portion of the program.

#### Thinking About Recursion
How should you think about a recursive subprogram? Do not immediately try to trace through the execution of the recursive calls; doing so is likely to simply confuse you. Rather, think of recursion as working via the power of wishful thinking. Consider the operation of fact(4) using the recursive formulation of fact. 4 is not 1, so the recursive case holds. The recursive case says to multiply fact(3) by 4. Here is where the wishful thinking comes in: wish for fact(3) to be calculated. Because this is a recursive call, your wish will be granted. You now know that fact(3)=6. So fact(4) is equal to 6 times 4, or 24 (which is just what it's supposed to be).

An analogy you can use to help you think this way is corporate management. When the CEO of a corporation tells a vice-president to perform some task, the CEO doesn't worry about how the task is accomplished; he or she relies on the vice-president to get it done. You should think the same way when you are programming recursively. Delegate the subtask to the recursive call; don't worry about how the task actually gets done. Worry instead whether the top-level task will get done properly, given that all the recursive calls work properly.

Another way to think about recursion is to pretend that a recursive call is actually a call to a different function, written by somebody else, that performs the same task that your function performs. For example, suppose we had a library routine called libfact that returned the factorial of its argument. We could then write our own version of fact as:

```
int fact (int n) {

    if (n == 1) return 1;

    return n * libfact(n - 1);
}
```

This version of fact correctly returns one if its argument is one. If its argument is greater than one, it calls libfact to calculate (n-1)!, and multiplies the result by n. Because libfact is a library routine, we may assume that it works properly, in this case calculating the factorial of n-1. For example, if n is 4, then libfact is called with 3 as its argument; it returns 6. This is multiplied by 4 to get the desired result of 24.
This example points out that a recursive call is just like any other function call. In particular, a recursive call gets its own parameter list and local variables, just as libfact would. Furthermore, while the recursive call is executing, the top--level call sits there waiting for the recursive call to terminate. This means that execution doesn't halt when a recursive call finds itself at the base case; once the recursive call returns, the top level call then continues to execute.

