public class Cat extends Animal{
     private int lives;
     @Override //METHOD OVERRIDING
    public void speak(){
        System.out.println("meow");
    }

    @Override
    public String toString() {
        return "Cat{" +
                "lives=" +
                '}';
    }

    public int getLives() {
        return lives;
    }

    public void setLives(int lives) {
        this.lives = lives;
    }
}
