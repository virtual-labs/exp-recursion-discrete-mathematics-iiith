### Procedure

## Getting Started

Welcome to the Tower of Hanoi simulation! This interactive experiment will help you understand one of the most elegant examples of recursion in computer science. Follow this step-by-step guide to make the most of your learning experience.

### What You'll See

When you open the simulation, you'll find:

- **Three towers** (labeled Tower 1, Tower 2, and Tower 3)
- **A stack of colored disks** on Tower 1, arranged with the largest at the bottom and smallest on top
- **Control panels** on the right side with various options
- **Information sections** below explaining the mathematical concepts

### Your Mission

**Objective**: Move the entire stack of disks from Tower 1 to Tower 3

**The Golden Rules** (these are sacred - break them and the puzzle becomes impossible!):

1. **One disk at a time** - You can only move one disk per move
2. **Top disk only** - You can only pick up the topmost disk from any tower
3. **No big on small** - A larger disk can never be placed on top of a smaller disk

## How to Begin

### Step 1: Choose Your Challenge Level

Before starting, decide how many disks you want to work with:

- **Beginners**: Start with 3 disks (7 moves required) - great for understanding the concept
- **Intermediate**: Try 4 disks (15 moves required) - shows the complexity growth  
- **Advanced**: Challenge yourself with 5+ disks (31+ moves required) - for the brave!

Use the **disk count slider** in the control panel to adjust the number of disks.

Use the **disk count slider** in the control panel to adjust the number of disks.

### Step 2: Understanding the Interface

**Game Area:**

- **Canvas**: The main playing area where you'll see the three towers and disks
- **Move Counter**: Shows how many moves you've made vs. the optimal number
- **Timer**: Tracks how long you've been solving the puzzle

**Control Panel (Right Side):**

- **Recent Moves**: See your last few moves (helpful for tracking progress)
- **Game Setup**: Adjust disk count, undo moves, reset the game
- **Auto Solve**: Watch the computer solve it step-by-step (great for learning!)

## How to Play - Different Methods

### Method 1: Mouse/Touch Control (Easiest)

1. **Click and hold** on the disk you want to move (must be the top disk of a tower)
2. **Drag** the disk to the tower where you want to place it
3. **Release** to drop the disk
4. The game will automatically check if the move is valid

**Tips for Mouse Control:**

- The disk will highlight when you hover over it
- Invalid moves will be rejected automatically
- Take your time - there's no time pressure!

### Method 2: Keyboard Control (For Power Users)

- **Keys 1, 2, 3**: Select Tower 1, 2, or 3
- **Spacebar**: Pick up/drop the selected disk
- **R key**: Reset the game
- **Arrow keys**: Navigate between towers

### Method 3: Auto-Solve Learning Mode (Recommended for First-Time Users)

This is perfect if you want to understand the algorithm before trying it yourself:

1. Click **"Start Auto Solve"** in the control panel
2. Watch as the algorithm breaks down the problem
3. Use **"Next"** and **"Previous"** buttons to step through each move
4. Observe how the towers are labeled (FROM, TO, AUX) during recursion
5. Try to predict the next move before clicking "Next"

## How to Proceed - Strategic Thinking

### For Beginners (3 Disks)

**The Pattern to Learn:**

1. Move the small disk to Tower 3
2. Move the medium disk to Tower 2  
3. Move the small disk from Tower 3 to Tower 2 (on top of medium)
4. Move the large disk to Tower 3
5. Move the small disk to Tower 1
6. Move the medium disk from Tower 2 to Tower 3
7. Move the small disk to Tower 3 - Success!

**Key Insight**: Notice how you always move the smallest disk first, and it alternates between towers in a predictable pattern!

### For Intermediate Players (4+ Disks)

**Think Recursively:**

1. **Identify the largest disk** - this needs to end up on Tower 3
2. **Clear the path** - move all smaller disks out of the way to Tower 2
3. **Move the big disk** - now it can go directly to Tower 3
4. **Reunite the family** - move all the smaller disks from Tower 2 to Tower 3

**Pro Tip**: The pattern repeats! Moving n-1 disks is just a smaller version of the same problem.

### When You Get Stuck

**Don't Panic! Here's What to Do:**

1. **Use the Undo Button** - Go back and try a different approach
2. **Reset and Watch Auto-Solve** - Learn from the optimal solution
3. **Start with Fewer Disks** - Master 3 disks before attempting more
4. **Think One Disk at a Time** - Don't try to plan too many moves ahead

## The Recursive Algorithm Explained

### Understanding the Big Picture

The Tower of Hanoi is solved using a **divide-and-conquer** approach. Instead of trying to move all disks at once, we break it into smaller, manageable pieces.

**The Recursive Mindset:**
"To solve a big problem, solve smaller versions of the same problem first!"

### Algorithm Parameters (The Recipe Ingredients)

Every recursive call needs these four pieces of information:

- **n**: The number of disks to move (starts with your total disk count)
- **source**: The tower where the disks currently are (initially Tower 1)
- **destination**: The tower where the disks need to go (Tower 3 for the main goal)
- **auxiliary**: The helper tower used for temporary storage (Tower 2 when moving from 1 to 3)

### The Three-Step Dance

**Base Case (The Simple Part):**
If there's only one disk (n = 1), just move it directly from source to destination. Done!

**Recursive Case (The Clever Part):**
For n > 1 disks, we perform this three-step dance:

1. **Move n-1 disks** from source tower to auxiliary tower
   - This clears the way for the largest disk
   - Uses destination tower as a temporary helper
   - This is a smaller version of the original problem!

2. **Move the largest disk** from source tower to destination tower
   - Now the biggest disk is in its final position
   - This is always just one simple move

3. **Move n-1 disks** from auxiliary tower to destination tower
   - Reunites all the smaller disks with the largest one
   - Uses source tower as a temporary helper
   - Again, this is a smaller version of the original problem!

### Seeing Recursion in Action

**Use the Step-by-Step Visualization to:**

- **Watch the algorithm think** - See how it breaks down each problem
- **Understand tower roles** - Notice how towers change roles (FROM, TO, AUX)
- **Follow the recursion depth** - See how deep the recursive calls go
- **Predict the next move** - Test your understanding by guessing what comes next

**Navigation Tips:**

- Use **"Next"** to move forward through the solution
- Use **"Previous"** to go back and review steps
- Watch the **recursion message** at the top to understand the current step
- Notice how **tower colors change** to show their current roles

## The Mathematics Behind the Magic

### Why Does This Work?

The beauty of recursion is that it **reduces complexity**:

- Moving 5 disks becomes: move 4 disks + move 1 disk + move 4 disks
- Moving 4 disks becomes: move 3 disks + move 1 disk + move 3 disks
- And so on... until we reach the base case of moving just 1 disk

### The Numbers Game

**Minimum Moves Required**: 2ⁿ - 1 (where n = number of disks)

**Real Examples:**

- **3 disks**: 2³ - 1 = 7 moves (perfect for beginners)
- **4 disks**: 2⁴ - 1 = 15 moves (getting interesting!)
- **5 disks**: 2⁵ - 1 = 31 moves (now we're talking!)
- **8 disks**: 2⁸ - 1 = 255 moves (marathon level!)

**The Recurrence Relation**: T(n) = 2T(n-1) + 1, with T(1) = 1

This means: To solve n disks, you need to solve the (n-1) problem twice, plus one move for the largest disk.

### Fun Fact: The Legend

According to legend, Buddhist monks in a temple are moving 64 golden disks following these same rules. When they finish, the world will end! At one move per second, it would take about 585 billion years. Don't worry - the universe is only about 14 billion years old! 😄
