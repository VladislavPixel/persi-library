## **HashTable.**

Внутри использует персистентный узел для списков.

### Properties:

1. versions;

2. historyChanges;

3. totalVersions;

### Инициализация.

_Аргументы:_ iterableData?, iterableKeys?;

iterableData - объект JavaScript или итерируемая структура, значения которой будут использоваться как values hashTable.

iterableKeys - итерируемая структура, значения которой будут использоваться как keys hashTable.

Если передается объект, а второй аргумент undefined, Persi использует его в качестве дефолтных данных.

```
new HashTable({ name: "Maxim", age: 33, home: { city: "Tula" } });
```

Если оба аргумента не переданы, то в качестве дефолтных данных будет установлен: {}.

```
new HashTable();
```

Пример с передачей двух итерируемых структур.

```
new HashTable(["Maxim", 24, "programmer"], ["name", "age", "job"]);
```

Если ключ iterableKeys будет являться не строкой, то будет брошено исключение.

### Symbol.iterator.

Возвращает объект итератора, который несет в себе value: { key, value }.

### Методы:

#### **-set(configChange) { }**

_Возвращает_: номер новой версии после обновления.

_Аргументы:_ configChange;

configChange - обязательный аргумент, который может быть просто значением (если это примитив), или объектом если свойство value hashTable требуется проинициализировать ссылочным значением (type object).

Для примитива:

```
const hashTable = new HashTable();

hashTable.set(225);
```

Для ссылочных значений если трубуется перезаписать полностью hashTable:

```
const hashTable = new HashTable();

hashTable.set({ value: { name: "Vlad", age: 24 } })
```

Для ссылочных значений если трубуется изменить где-то вложенный ключ hashTable:

```
const hashTable = new HashTable({ model: 756, engine: { type: "cool", cnip: 72 } });

hashTable.set({ value: 155, path: "value/engine/cnip" })
```

{ value: ..., path: ... } - value любое значение; path - строка, которая начинается всегда с "value". Если path будет передан некорректно (такая вложенность не будет содержаться или строка начинается не с value) Persi бросит исключение.

Совет по использованию:

```
const hashTable = new HashTable();

hashTable.set({ value: { type: "user", age: 33 }, path: "value" })
```

Старайтесь всегда передавать объект для корректной работы.

#### **-get(numberVersion, path) { }**

_Возвращает_: value запрашиваемого значения.

_Аргументы:_ numberVersion, path;

numberVersion (number) - номер версии, в которой вы хотите отыскать значение.

path (string) - Путь к свойству, значение которого Вы хотите получить. Может быть либо "value", либо "value/home/car/type", но будьте ОСТОРОЖНЫ при втором подходе, вы должны четко понимать структуру вашей hashTable в конкретной версии, если вы обращаетесь к глубокой вложенности, которой нет - Persi бросит исключение.

Например:

В этом примере будет брошено исключение.

```
const hashTable = new HashTable({ type: "user", age: 33 });

hashTable.get(0, "value/home/city")
```

В этом примере тоже будет брошено исключение.

```
const hashTable = new HashTable({ type: "user", age: 33, home: { city: "Novosibirsk" } });

hashTable.get(0, "value/home/city/code/vnm")
```

Корректное обращение - получим "user".

```
const hashTable = new HashTable({ type: "user", age: 33 });

hashTable.get(0, "value/type")
```

Если мы обратимся к свойству объекта, которого нет, но при этом не нарушим path - получим undefind: это реализация обычной логики всех объектов JavaScript.

```
const hashTable = new HashTable({ type: "user", age: 33 });

hashTable.get(0, "value/name")
```

### Работа с версиями в рамках hashTable.

_Возвращает_: версию по конкретному переданному значению.

_Аргументы:_ indexVersion?;

indexVersion - необязательный аргумент, который может быть undefined / number (номер версии) / "+1" / "-1".

В случае если indexVersion не передан или он равен undefined, вы получите последнюю актуальную версию hashTable. Если вы передаете номер версии и этот номер укладывается в диапазон, то вы получите свою версию hashTable. Для передачи значений "+1", "-1" вы первоначально должны проинициализировать index последней запрашиваемой версии иначе Persi не сможет понять с какого номера ему делать сдвиг. "+1" получаем версию которая выше последней запрашиваемой версии, "-1" получаем версию, которая ниже последней запрашиваемой версии.

Пример обращения:

```
hashTable.versions.at(indexVersion);
```

Пример работы с версиями:

```
const hashTable = new HashTable({ type: "user", age: 33 });

hashTable.set({ value: "Pixel.", path: "value/name" });

hashTable.set({ value: 30, path: "value/age" });

const v0 = hashTable.versions.at(0);

const v1 = hashTable.versions.at("+1");

const v2 = hashTable.versions.at("+1");
```

Еще пример:

```
const hashTable = new HashTable({ type: "user", age: 33 });

hashTable.set({ value: "Pixel.", path: "value/name" });

hashTable.set({ value: 30, path: "value/age" });

const v2 = hashTable.versions.at();

const v1 = hashTable.versions.at("-1");

const v0 = hashTable.versions.at("-1");
```

### Работа с историей изменений в рамках hashTable.

_Возвращает_: ItemHistory.

_Аргументы:_ indexChange?;

indexChange - необязательный аргумент, который может быть undefined / number (номер изменения) / "+1" / "-1".

Работа метода at(indexChange) для истории изменений аналогична работе at(indexVersion) для версий.

Пример обращения:

```
hashTable.historyChanges.at();
```

Стоит отметить, что у historyChanges можно вызывать метод display(), который выведет в консоль кратко всю историю изменений.

```
hashTable.historyChanges.display();
```

## **RedBlackTree.**

Красно-черное дерево для узлов задействует персистентные узлы деревьев.

### Properties:

1. length;

2. versions;

3. historyChanges;

4. root;

5. totalVersions;

### Инициализация.

RedBlackTree не принимает никаких данных в конструктор при создании, его root инициализируется значением null. Нулевая версия в versions устанавливается в null.

Пример использования:

```
new RedBlackTree();
```

### Symbol.iterator.

Обходит дерево прямым обходом в глубину.

### Методы:

#### **-insert(value, key, options?) { }**

_Возвращает_: новое значение длины после вставки.

_Аргументы:_ value, key, options?;

value - любое значение, которое нужно сохранить в узле.

key - любое значение ключа, под которым надо сохранить значение. Ключ должен быть сравним с другими ключами. Желательно, чтобы все ключи были одного типа.

options - необязательный аргумент. Представляет из себя объект с ключом { nameMethodForHistory: ... }. Как правило вам его передавать не нужно, значение этого ключа определяет nameMethod в ItemHistory. За Вас об этом позаботится Persi.

Пример использования:

```
redBlackTree.insert("color", 25);
```

#### **-getIteratorForDepthSymmetrical() { }**

_Возвращает_: итератор, который нужен для центрированного (симметричного) обхода дерева в глубину.

_Аргументы:_ -;

#### **-getIteratorForDepthReverse() { }**

_Возвращает_: итератор, который нужен для обратного обхода дерева в глубину.

_Аргументы:_ -;

#### **-getIteratorForWidthTraversal() { }**

_Возвращает_: итератор, который нужен для обхода дерева в ширину.

_Аргументы:_ -;

#### **-findByKey(key) { }**

_Возвращает_: null или значение конкретного узла.

_Аргументы:_ key;

key - любой тип значения, главное, чтобы он был сравним с другими ключами.

Пример использования:

```
redBlackTree.findByKey(175);
```

#### **-get(numberVersion, pathNodeValue, middlewareS?) { }**

_Возвращает_: значение указанной версии (numberVersion) первого узла корня по пути pathNodeValue, если middlewareS не был передан. Если middlewareS был передан, то того узла, который был найден при помощи middlewareS.

_Аргументы:_ numberVersion, pathNodeValue, middlewareS?;

numberVersion (number) - номер версии.

pathNodeValue (string) - путь до конкретного значения. В случае, если pathNodeValue будет некорректным Persi бросит исключение. Если вы запрашиваете плоский путь объекта, а у него нет такого ключа получите undefined (стандартная логика JavaScript).

В случае попытки вызова get(numberVersion, pathNodeValue, middlewareS) { } для "0" версии Вы всегда будете получать null, т.к. "0" версия RedBlackTree null, поскольку вы не можете ее проинициализировать дефолтными значениями. Такой результат будет исходить независимо от того, какой был передан pathNodeValue и middlewareS. Persi знает, что "0" версия RedBlackTree = null.

middlewareS([ callbackFn, ... ]) - необязательный аргумент, массив с вашими callback функциями. Вы можете использовать промежуточное ПО, если перед тем как получить значение узла дерева, требуется еще найти этот узел в самом дереве. Первая callback функция вышего массива всегда получает структуру всего дерева (root) для указанной вами в 1 аргументе версии. Внутри callback вы можете, например, вызвать findByKey(key) { } метод для того, чтобы найти узел или сделать что-то промежуточное. Очень важно после этого вернуть результат (в случае с findByKey(key) { } возвращается найденный узел). Все последующие функции middlewareS получают результат предыдущей функции - делаю свою логику - передают дальше. Если внутри middlewareS что-то работает не так вы получите исключение или ошибку.

Пример использования без 3 аргумента:

```
redBlackTree.get(3, "value/moment");
```

Пример использования c middlewareS:

```
const searchNodeRedBlackTree = (tree) => {
	const node = tree.findByKey(175);

	return node;
};

redBlackTree.get(3, "value/moment", [searchNodeRedBlackTree]);
```

### Работа с версиями в рамках redBlackTree.

_Возвращает_: Версию по конкретному переданному значению.

_Аргументы:_ indexVersion?;

indexVersion - необязательный аргумент, который может быть undefined / number (номер версии).

В случае если indexVersion не передан или он равен undefined, вы получите последнюю актуальную версию redBlackTree. Если вы передаете номер версии и этот номер укладывается в диапазон, то вы получите свою версию redBlackTree.

Пример обращения:

```
redBlackTree.versions.at(indexVersion);

// или

redBlackTree.versions.at();
```

### Работа с историей изменений в рамках redBlackTree.

Осуществляется аналогично hashTable.

## **SetStructure.**

Внутри используется красно-черное дерево с персистентными узлами для деревьев.

### Properties:

1. length;

2. versions;

3. historyChanges;

4. root;

5. totalVersions;

6. size;

### Инициализация.

Для инициализации SetStructure первичными данными можно передать любой iterable объект или ничего не передавать, тогда начальное состояние SetStructure будет null.

```
new SetStructure();

new SetStructure(["name", 15, 56, 43]);
```

### Symbol.iterator.

Обходит дерево в порядке добавления элементов.

### Методы:

#### **-entries() { }**

_Возвращает_: итератор, содержащий массив [value, value] для каждого элемента SetStructure объекта в порядке вставки.

_Аргументы:_ -;

Пример использования:

```
setStructure.entries();
```

#### **-values() { }**

_Возвращает_: новый объект Iterator, который содержит значения для каждого элемента SetStructure объекта в порядке вставки.

_Аргументы:_ -;

Пример использования:

```
setStructure.values();
```

#### **-keys() { }**

_Возвращает_: новый объект Iterator, который содержит значения для каждого элемента SetStructure объекта в порядке вставки. Является псевдонимом values() метода.

_Аргументы:_ -;

Пример использования:

```
setStructure.keys();
```

#### **-forEach(callbackFn, thisArg?) { }**

Метод выполняет предоставленную функцию один раз для каждого значения в SetStructure объекте в порядке вставки.

_Возвращает_: void.

_Аргументы:_ callbackFn, thisArg?;

callbackFn - ваша функция, принимающая 3 аргумента: value, key, set. value и key фактически одно и тоже значение. set - это сама структура.

thisArg? - контекст выполнения. Необязательный аргумент. По умолчанию this указывает на саму структуру set.

Пример использования:

```
setStructure.forEach((key, value, setIns) => console.log(`${key} = ${value}`, setIns))
```

#### **-has(value) { }**

Метод проверяет существует ли элемент с указанным значением в SetStructure или нет.

_Возвращает_: true / false.

_Аргументы:_ value;

value - любой тип значения.

Пример использования:

```
setStructure.has("name");
```

#### **-add(value) { }**

Добавляет значение в SetStructure.

_Возвращает_: новую длину SetStructure.

_Аргументы:_ value;

value - любой тип данных, который вы хотите сохранить в SetStructure.

Пример использования:

```
setStructure.add(200);
```

#### **-clear() { }**

Удаляет все элементы из SetStructure. Новая пуста версия будет сохранена.

_Возвращает_: void.

_Аргументы:_ -;

Пример использования:

```
setStructure.clear();
```

#### **-get(numberVersion, pathNodeValue, middlewareS?) { }**

Этот метод работает по такому же принципу, что и в redBlackTree.

#### **-findByKey(key) { }**

Этот метод работает по такому же принципу, что и в redBlackTree.

### Работа с версиями в рамках SetStructure.

Осуществляется так же как и в RedBlackTree.

### Работа с историей изменений в рамках SetStructure.

Осуществляется аналогично hashTable.

## **OneWayLinkedList.**

Хранит свои значения в персистентных узлах для списков.

### Properties:

1. head;

2. length;

3. versions;

4. historyChanges;

5. totalVersions;

### Инициализация.

_Аргументы:_ iterable?;

iterable? - должен быть итерируемым объектом. В случае передачи этого аргумента, значение будет установлено. Если iterable = undefined, начальное состояние одностороннего связанного списка будет null и в качестве "0" версии запишется null.

Пример использования:

```
new OneWayLinkedList(["name", 155, { age: 24 }]);

new OneWayLinkedList();
```

### Symbol.iterator.

Возвращает итератор, который несет в себе значения со всеми примененными changeLog.

### Методы:

#### **-getIteratorNewAndOldNodes() { }**

_Возвращает_: итератор, который берет связанный список в текущем состоянии и проходится по всем элементам, возвращая узел, который применил к себе весь свой log изменений и узел, который не применял log изменений { latestVersionN: ..., stockN: ... }.

_Аргументы:_ -;

Пример использования:

```
oneWayLinkedListInstance.getIteratorNewAndOldNodes();
```

#### **-addFirst(value) { }**

_Возвращает_: новую длину списка, если именно с этой структурой вы сейчас работаете, если OneWayLinkedList является составным родительским элементом вашей структуры, например для TwoWayLinkedList, то возвращается объект конфигурации для использования в дочернем классе, который требуется ему для своих обновлений. { newLength: ..., lastNode: ..., firstNode: ... }

newLength - новая длина;

lastNode - если при добавлении узла был вызван cloneCascading и рекурсия дошла до последнего узла списка и обновила его: lastNode будет Node, если рекурсия остановилась раньше вернет null, что скажет дочернему классу о неизменении последнего узла.

firstNode - всегда возвращает первый элемент.

_Аргументы:_ value;

value - любое значение, которое трубуется сохранить.

Пример использования:

```
oneWayLinkedListInstance.addFirst(155);
```

#### **-deleteFirst() { }**

_Возвращает_: по такому же принципу как и метод addFirst(value) { }, удаляемый элемент или { newLength: ..., lastNode: ..., firstNode: ..., result: ... }.

_Аргументы:_ -;

Пример использования:

```
oneWayLinkedListInstance.deleteFirst();
```

#### **-findByKey(key) { }**

Ищет узел по ключу.

_Возвращает_: null или узел без примененного log изменений;

_Аргументы:_ key;

Пример использования:

```
oneWayLinkedListInstance.findByKey(200);
```

#### **-set(configForValueNode, middlewareS?) { }**

Вносит изменение в узел.

_Возвращает:_ обновленный узел, если вы работаете именно с этой структурой или же, если oneWayLinkedList является родительским классом, то { updatedNode, firstNode, lastNode, newTotalVersion }.

updatedNode - обновленный узел, которому вносятся изменения;

firstNode - первый элемент;

lastNode - последний элемент;

newTotalVersion - версия после обновления;

_Аргументы:_ configForValueNode, middlewareS?;

Различные вариации использования:

```
oneWayLinkedListInstance.set({ value: "strict", path: "value/home/car" });

oneWayLinkedListInstance.set({ value: 128 });

oneWayLinkedListInstance.set({ value: "name", path: "value" });

const searchNodeFn1 = (list) => {
	const node = list.findByKey({ path: "value", value: 2555502 });

	return node;
};

oneWayLinkedListInstance.set({ value: 4444444 }, [searchNodeFn1]);
```

{ value: "strict", path: "value/home/car" } - path прописывать надо аккуратно для обновления, если вы не соблюдаете вложенность бросится исключение;

{ value: 128 } - ключ value узла будет полностью перезаписан этим значением.

{ value: "name", path: "value" } - отработает как верхний вариант.

middlewareS - 2 аргумент, необязательный. Это массив из пользовательских функций, которые выполняются по цепочке, передавая дальше результат. Первая функция в качестве аргумента получает список, все последующие результат предыдущего вызова, именно поэтому результат надо возвращать. Вам может это понадобиться, если вы не хотите обновлять 1 элемент списка, а Вам требуется сначала отыскать нужный узел по ключу + возможно, сделать какие-то вызовы дополнительно.

#### **-get(numberVersion, pathNodeValue, middlewareS?) { }**

Метод используется для получения значения.

_Возвращает_: запрашиваемое значение конкретного узла.

_Аргументы:_ numberVersion, pathNodeValue, middlewareS?;

numberVersion (number) - номер версии.

pathNodeValue (string) - путь до значения.

middlewareS? ([ callbackFn ]) - массив с пользовательскими функциями промежуточного ПО.

Пример использования с промежуточным ПО:

```
const searchNodeFn = (node) => {
	const res = node.findByKey({ path: "value/home/target", value: "Moscow" });

	return res;
};

oneWayLinkedListInstance.get(12, "value/home", [searchNodeFn]);
```

Пример использования без middlewareS (поиск будет осуществляться в первом узле):

```
oneWayLinkedListInstance.get(6, "value/name");
```

### Работа с версиями в рамках OneWayLinkedList.

Осуществляется так же как и в RedBlackTree.

### Работа с историей изменений в рамках OneWayLinkedList.

Осуществляется аналогично hashTable.

## **TwoWayLinkedList.**

Хранит свои значения в персистентных узлах для списков.

### Properties:

1. head;

2. tail;

3. length;

4. versions;

5. historyChanges;

6. totalVersions;

### Инициализация.

_Аргументы:_ iterable?;

iterable? - должен быть итерируемым объектом. В случае передачи этого аргумента, значение будет установлено. Если iterable = undefined, начальное состояние двустороннего связанного списка будет null и в качестве "0" версии запишется null.

Пример использования:

```
new TwoWayLinkedList(["name", 155, { age: 24 }]);

new TwoWayLinkedList();
```

### Symbol.iterator.

Возвращает итератор, который несет в себе значения со всеми примененными changeLog.

### Методы:

#### **-getIteratorNewAndOldNodes() { }**

Логика такая же как и в OneWayLinkedList.

#### **-addFirst(value) { }**

Логика такая же как и в OneWayLinkedList.

#### **-deleteFirst() { }**

Логика такая же как и в OneWayLinkedList.

#### **-findByKey(key) { }**

Логика такая же как и в OneWayLinkedList.

#### **-set(configForValueNode, middlewareS?) { }**

Логика такая же как и в OneWayLinkedList.

#### **-get(numberVersion, pathNodeValue, middlewareS?) { }**

Логика такая же как и в OneWayLinkedList.

#### **-addLast(value) { }**

Метод используется для добавления элемента в конец списка.

_Возвращает_: новая длина twoWayLinkedList если мы работаем именно с этой структурой, если TwoWayLinkedList является составным родительским элементом вашей структуры, например для DoublyLinkedList, то возвращается объект конфигурации для использования в дочернем классе, который требуется ему для своих обновлений. { newLength: ..., lastNode: ..., firstNode: ... }.

_Аргументы:_ value;

value - любое значение, которое вы хотите сохранить в конце списка.

Пример использования:

```
twoWayLinkedListInstance.addLast(255);
```

#### **-deleteLast() { }**

Используется для удаления с конца списка.

_Возвращает_: удаленный элемент или по аналогии с addlast() - { newLength: ..., result: ..., firstNode: ..., lastNode: ... }

result - удаляемый элемент.

_Аргументы:_ -;

Пример использования:

```
twoWayLinkedListInstance.deleteLast();
```

### Работа с версиями в рамках TwoWayLinkedList.

Осуществляется так же как и в RedBlackTree.

### Работа с историей изменений в рамках TwoWayLinkedList.

Осуществляется аналогично hashTable.

## **DoublyLinkedList.**

Хранит свои значения в персистентных узлах для списков.

### Properties:

1. size;

2. totalVersions;

### Инициализация.

_Аргументы:_ iterable?;

iterable? - должен быть итерируемым объектом. В случае передачи этого аргумента, значение будет установлено. Если iterable = undefined, начальное состояние двустороннего связанного списка будет null и в качестве "0" версии запишется null.

Пример использования:

```
new DoublyLinkedList(["name", 155, { age: 24 }]);

new DoublyLinkedList();
```

### Symbol.iterator.

Возвращает итератор, который несет в себе значения со всеми примененными changeLog.

### Методы:

Реализует интерфейс TwoWayLinkedList, поэтому методы повторяются.

#### **-getIteratorForReverseValueLastVersion() { }**

Возвращает итератор, который реализует проход по элементам последней версии начиная с хвоста.

### Работа с версиями в рамках DoublyLinkedList.

Осуществляется так же как и в RedBlackTree.

### Работа с историей изменений в рамках DoublyLinkedList.

Осуществляется аналогично hashTable.

## **DecQueue.**

Хранит свои значения в персистентных узлах для списков.

### Properties:

1. size;

2. totalVersions;

### Инициализация.

_Аргументы:_ -;

Пример использования:

```
new DecQueue();
```

### Symbol.iterator.

Возвращает итератор, который несет в себе значения со всеми примененными changeLog.

### Методы:

#### **-insertFirst(value) { }**

Вставляет элемент в начало дек.

_Возвращает_: новую длину очереди;

_Аргументы:_ value;

value - любое значение, которое вы хотите вставить в дек.

Пример использования:

```
decQueueInstance.insertFirst({ type: "user", name: "Max" });
```

#### **-insertLast(value) { }**

Вставляет элемент в конец дек.

_Возвращает_: новую длину дек;

_Аргументы:_ value;

value - любое значение, которое вы хотите вставить в дек.

Пример использования:

```
decQueueInstance.insertLast(500);
```

#### **-removeFirst() { }**

Удаляет первый элемент из дек.

_Возвращает_: значение удаленного элемента;

_Аргументы:_ -;

Пример использования:

```
decQueueInstance.removeFirst();
```

#### **-removeLast() { }**

Удаляет последний элемент из дек.

_Возвращает_: значение удаленного элемента;

_Аргументы:_ -;

Пример использования:

```
decQueueInstance.removeLast();
```

#### **-peekFirst() { }**

Возвращает значение первого элемента из дек.

_Возвращает_: значение первого элемента;

_Аргументы:_ -;

Пример использования:

```
decQueueInstance.peekFirst();
```

#### **-peekLast() { }**

Возвращает значение последнего элемента из дек.

_Возвращает_: значение последнего элемента;

_Аргументы:_ -;

Пример использования:

```
decQueueInstance.peekLast();
```

### Работа с версиями в рамках DecQueue.

Осуществляется так же как и в RedBlackTree.

### Работа с историей изменений в рамках DecQueue.

Осуществляется аналогично hashTable.

## **Queue.**

Хранит свои значения в персистентных узлах для списков.

### Properties:

1. size;

2. totalVersions;

### Инициализация.

_Аргументы:_ -;

Пример использования:

```
new Queue();
```

### Symbol.iterator.

Возвращает итератор, который несет в себе значения со всеми примененными changeLog.

### Методы:

#### **-insert(value) { }**

Вставляет элемент в конец очереди.

_Возвращает_: новую длину очереди;

_Аргументы:_ value;

value - любое значение, которое вы хотите вставить в очередь.

Пример использования:

```
queueInstance.insert({ type: "user", name: "Max" });
```

#### **-remove() { }**

Удаляет первый элемент из очереди.

_Возвращает_: значение удаленного элемента;

_Аргументы:_ -;

Пример использования:

```
queueInstance.remove();
```

#### **-peekFirst() { }**

Дает возможность посмотреть первый элемент очереди.

_Возвращает_: значение первого элемента;

_Аргументы:_ -;

Пример использования:

```
queueInstance.peekFirst();
```

### Работа с версиями в рамках Queue.

Осуществляется так же как и в RedBlackTree.

### Работа с историей изменений в рамках Queue.

Осуществляется аналогично hashTable.

## **Stack.**

Хранит свои значения в персистентных узлах для списков.

### Properties:

1. size;

2. totalVersions;

### Инициализация.

_Аргументы:_ -;

Пример использования:

```
new Stack();
```

### Symbol.iterator.

Возвращает итератор, который несет в себе значения со всеми примененными changeLog.

### Методы:

#### **-push(value) { }**

Кладет элемент на верх стека.

_Возвращает_: новую длину стэка;

_Аргументы:_ value;

value - любое значение, которое вы хотите положить на стэк.

Пример использования:

```
stackInstance.push(777);
```

#### **-pop() { }**

Удаляет элемент с вершины стека и возвращает значение.

_Возвращает_: значение удаленного элемента;

_Аргументы:_ -;

Пример использования:

```
stackInstance.pop();
```

#### **-peek() { }**

Дает возможность посмотреть значение элемента на вершине стэка.

_Возвращает_: значение элемента;

_Аргументы:_ -;

Пример использования:

```
stackInstance.peek();
```

### Работа с версиями в рамках Stack.

Осуществляется так же как и в RedBlackTree.

### Работа с историей изменений в рамках Stack.

Осуществляется аналогично hashTable.
