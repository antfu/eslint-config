// Define a TypeScript interface
interface Person {
  name: string
  age: number
}

// Create an array of objects with the defined interface
const people: Person[] = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 },
]

// eslint-disable-next-line no-console
const log = console.log

// Use a for...of loop to iterate over the array
for (const person of people)
  log(`Hello, my name is ${person.name} and I am ${person.age} years old.`)

// Define a generic function
function identity< T >(arg: T): T {
  return arg
}

// Use the generic function with type inference
const result = identity(
  'TypeScript is awesome',
)
log(result)

// Use optional properties in an interface
interface Car {
  make: string
  model?: string
}

// Create objects using the interface
const car1: Car = { make: 'Toyota' }
const car2: Car = {
  make: 'Ford',
  model: 'Focus',
}

// Use union types
type Fruit = 'apple' | 'banana' | 'orange'
const favoriteFruit: Fruit = 'apple'

// Use a type assertion to tell TypeScript about the type
const inputValue: any = '42'
const numericValue = inputValue as number

// Define a class with access modifiers
class Animal {
  private name: string
  constructor(name: string) {
    this.name = name
  }

  protected makeSound(sound: string) {
    log(`${this.name} says ${sound}`)
  }
}

// Extend a class
class Dog extends Animal {
  constructor(private alias: string) {
    super(alias)
  }

  bark() {
    this.makeSound('Woof!')
  }
}

const dog = new Dog('Buddy')
dog.bark()

function fn(): string {
  return `hello${1}`
}

log(car1, car2, favoriteFruit, numericValue, fn())
