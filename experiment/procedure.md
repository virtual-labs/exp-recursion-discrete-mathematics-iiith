### Procedure

- Three rods (labeled A, B, and C)
- A stack of disks with varying sizes, where the largest disk is at the bottom and the smallest is on top (usually placed on rod A)

- Move the entire stack of disks from rod A to rod C, following these rules:

- - Only one disk can be moved at a time.
- - You can only move the top disk from any rod.
- - A larger disk cannot be placed on a smaller disk.


- **n**: The number of disks to move, can be set using dropdown.
- **source**: The rod where the disks currently are (initially A).
- **destination**: The rod where the disks need to reach (C).
- **auxiliary**: An extra rod (B) used as a helper.

- The Base Case : If there's only one disk (n == 1), it's a simple move. We just pick it up from the source rod and place it on the destination rod.

- The Recursive Case (Breaking it Down): Things get trickier with more disks. Here's the plan:

- Move all but the largest disk (n-1) from the source rod to the auxiliary rod. We'll use the move_disk function again, but this time the destination becomes the auxiliary rod. This frees up the biggest disk on the source rod.

- Now that the biggest disk is exposed, move it from the source rod to the destination rod. It's finally in its rightful place!

- Finally, move the remaining n-1 disks from the auxiliary rod to the destination rod. Again, we'll use the move_disk function, but this time the source becomes the auxiliary rod.

- Putting it All Together: To start the process, call move_disk(total_disks, A, C, B). Here, total_disks represents the number of disks in the initial stack.