import java.util.*;

class MinesGame {

  static Scanner scr = new Scanner(System.in);
  static HashSet<Integer> mines = new HashSet<>();
  static int gridSize;

  public static void main(String[] args) {
    System.out.println("------------------------------------");
    System.out.println("GAME START");
    System.out.println("Number of mines");
    int minesCount = scr.nextInt();

    gridSize = 5;
    if (!checkValidity(gridSize, minesCount)) {
      System.out.println("INVALID NUMBER OF MINES !!");
    } else {
      generateMines(gridSize, minesCount, mines);
      int score = playGame(gridSize, mines);
      System.out.println("*************************************");
      System.out.println("Final Score == " + score);
      System.out.println("*************************************");
    }
    System.out.println("GAME OVER");
    System.out.println("------------------------------------");
  }

  public static int playGame(int gridSize, HashSet<Integer> mines) {
    int score = 0;
    int count = mines.size();
    boolean[][] grid = new boolean[gridSize][gridSize];

    boolean gameOn = true;

    while (gameOn) {
      System.out.println("Select Tile");
      int tile = scr.nextInt();

      if (tile < 0 || tile >= (gridSize * gridSize)) {
        System.out.println("INVALID TILE!");
        continue;
      }

      int row = tile / gridSize;
      int col = tile % gridSize;

      if (grid[row][col]) {
        System.out.println("Tile Already Selected");
        continue;
      }

      grid[row][col] = true;
      count++;

      if (mines.contains(tile)) {
        System.out.println("OOPPS...Better Luck Next Time !!!");
        score = 0;
        gameOn = false;
      } else if (count == (gridSize * gridSize)) {
        score += 1;
        System.out.println("GENIUS ALL TILES DONE !!!");
        gameOn = false;
      } else {
        score += 1;
        System.out.println("HURAAYY...Keep Going !!!");
        System.out.println("Current Score : " + score);
      }
    }
    return score;
  }

  public static boolean checkValidity(int gridSize, int minesCount) {
    if (minesCount < 1) return false;

    if (minesCount >= (gridSize * gridSize)) return false;

    return true;
  }

  public static void generateMines(
    int gridSize,
    int minesCount,
    HashSet<Integer> mines
  ) {
    while (mines.size() != minesCount) {
      int random = (int) (Math.random() * 100);

      if (
        random >= 0 && random < (gridSize * gridSize) && !mines.contains(random)
      ) {
        mines.add(random);
      }
    }

    System.out.println(mines);
  }
}
