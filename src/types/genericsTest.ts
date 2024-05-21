// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck -- This file isn't actually used, I'm just messing about with
// the type system
type Associations<T extends Record<keyof T, string>> = {
  [P in keyof T]?: Array<T[P]>
}

type Contents<T extends Record<keyof T, string>, K extends keyof T> = { [P in T[K]]: {
  associations: Associations<T>
} };

type Fruits<T extends Record<keyof T, string>> = { [K in keyof T]: {
  contents: Contents<T, K>
} };

type InferFruitMap<T extends Fruits<Record<string, string>>> =
  { [K in keyof T]: Extract<keyof T[K]['contents'], string> } & object

const fruitMap = <T extends Fruits<Record<string, string>>>(t: T extends Fruits<InferFruitMap<T>> ? T : Fruits<InferFruitMap<T>>): Fruits<InferFruitMap<T>> => t;

// Overall data
const fruits = fruitMap({
  // There are broad categories which contain many items
  alfa: {
    contents: {
      // One such item in the 'alfa' category is 'apple'
      apple: {
        // Each item has associations with other items
        associations: {
          // 'apple' is associated with 'orange' from the 'oscar' category
          oscar: ['orange'],
          // and with 'grape' and 'grapefruit' from the 'golf' category
          golf: ['grape', 'grapefruit'],
          // If a category key is not included, that means this item is not
          // associated with any data in that category
        },
      },
    },
  },
  // Here is another category -- notice that keys from each 'associations'
  // object map to keys in the overall data
  golf: {
    contents: {
      grape: {
        associations: {
          // Also notice that items within the array are all keys within the
          // contents object of the listed category
          golf: ['grapefruit'],
        },
      },
      grapefruit: {
        associations: {
          alfa: ['apple'],
          golf: ['grape'],
        },
      }
    },
  },
  oscar: {
    contents: {
      orange: {
        // The orange item isn't associated with any data
        associations: {}
      }
    }
  }
});

// Example of error

const apple = fruits.alfa.contents.apple;

for (const association of apple.associations.golf) {
  // association should have a type like Association<'golf'>
  const associatedData = fruits.alfa.contents[association];
  //                            ~~~~          ^^^^^^^^^^^
  // Currently, TypeScript gives an error here because the data is hard-coded,
  // but without hard-coded data it would not know there is a problem.
  // I want TypeScript to use the type of `association` to recognise that it
  // cannot be used to access contents within `fruits.alfa` as it is an
  // association from the `golf` category.
  console.log(associatedData);
}

// However in this case, it should not produce an error because `association`
// has a type like Association<'golf'>`, and so accessing items in the contents
// of `fruits.golf` is safe.
for (const association of apple.associations.golf) {
  const associatedData = fruits.golf.contents[association];
  console.log(associatedData);
}
