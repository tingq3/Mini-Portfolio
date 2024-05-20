type CategoryName <Cat extends string> = string & { __cat: Cat }

// Name of an item
// Using a generic to represent the category it belongs to
type ItemName <Cat extends string, ItemCategory extends CategoryName<Cat>> = string & { __cat: ItemCategory };

// An item
type Item<Cat extends string, ItemCategory extends CategoryName<Cat>> = {
  name: ItemName<Cat, ItemCategory>,
  //             ^^^^^^^^^^^^
  // Name of item belonging to the given category
  description: string
  associations: Record<CategoryName, ItemName<'???'>>
  //                   ^^^^^^           ^^^^^
  // I don't know what to put in either of these spots
  // They should represent the universe of all possible categories
}

type Category<CategoryName extends string> = {
  name: CategoryName
  description: string
  contents: Record<ItemName<CategoryName>, Item<CategoryName>>,
}

// Overall data
const fruits = {
  // There are broad categories which contain many items
  alfa: {
    name: 'alfa',
    description: 'words starting with a',
    contents: {
      // One such item in the 'alfa' category is 'apple'
      apple: {
        name: 'apple',
        description: 'a fruit',
        // Each item has associations with other items
        associations: {
          // 'apple' is associated with 'orange' from the 'oscar' category
          oscar: ['orange'],
          // and with 'grape' and 'grapefruit' from the 'golf' category
          golf: ['grape', 'grapefruit'],
        },
      },
    },
  },
  // Here is another category -- notice that keys from each 'associations'
  // object map to keys in the overall data
  golf: {
    name: 'golf',
    description: 'words starting with g',
    contents: {
      grape: {
        name: 'grape',
        description: 'a small fruit',
        associations: {
          // Also notice that items within the array are all keys within the
          // contents object of the listed category
          golf: ['grapefruit'],
        },
      },
      grapefruit: {
        name: 'grapefruit',
        description: 'a citrus fruit',
        associations: {
          alfa: ['apple'],
          golf: ['grape'],
        },
      }
    },
  },
  // etc...
};

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
  console.log(associatedData.name);
}

// However in this case, it should not produce an error because `association`
// has a type like Association<'golf'>`, and so accessing items in the contents
// of `fruits.golf` is safe.
for (const association of apple.associations.golf) {
  const associatedData = fruits.golf.contents[association];
  console.log(associatedData.name);
}
