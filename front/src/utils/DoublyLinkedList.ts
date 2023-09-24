class ListNode<T> {
    public value: T;
    public next: ListNode<T>;
    public prev: ListNode<T>;
}

export class DoublyLinkedList<T> {
    private head: ListNode<T>;
    private tail: ListNode<T>;
    private size: number;

    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    public length(): number {
        return this.size;
    }

    public isEmpty(): boolean {
        return this.size === 0;
    }

    public toArray(): T[] {
        const array: T[] = [];
        let currentElement = this.head;
        while (currentElement != null) {
            array.push(currentElement.value);
            currentElement = currentElement.next;
        }
        return array;
    }

    private getNode(index: number): ListNode<T> {
        if (index >= this.size || this.isEmpty()) {
            throw new RangeError("Index out of range.");
        }
        if (index > this.size / 2) {
            let i = (this.size - 1) - index;
            let tmp = this.tail;
            while (i > 0) {
                tmp = tmp.prev;
                i--;
            }
            return tmp;
        }
        else {
            let tmp = this.head;
            for (let i = 0; i < index; i++) {
                tmp = tmp.next;
            }
            return tmp;
        }
    }

    public get(index: number): T {
        return this.getNode(index).value;
    }

    public getPrev(index: number): T {
        return this.getNode(index).prev.value;
    }

    public getNext(index: number): T {
        return this.getNode(index).next.value;
    }

    public set(index: number, value: T) {
        this.getNode(index).value = value;
    }

    public push(value: T) {
        const newNode = new ListNode<T>;
        newNode.value = value;
        newNode.next = null;
        if (this.isEmpty()) {
            newNode.prev = null;
            this.head = newNode;
            this.tail = newNode;
            this.size++;
        }
        else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
            this.size++;
        }
    }

    public remove(index: number): T {
        if (index >= this.size || this.isEmpty()) {
            throw new RangeError("Index out of range.");
        }
        if (this.length() === 1) {
            this.head = null;
            this.tail = null;
            this.size = 0;
        }
        else {
            const forRemove = this.getNode(index);
            let closerElement: ListNode<T> = null;
            if (forRemove === this.head) {
                closerElement = this.head.next;
                this.head.next.prev = null;
                this.head = this.head.next;
            }
            else if (forRemove === this.tail) {
                closerElement = this.tail.prev;
                this.tail.prev.next = null;
                this.tail = this.tail.prev;
            }
            else {
                closerElement = forRemove.prev;
                forRemove.prev.next = forRemove.next;
                forRemove.next.prev = forRemove.prev;
            }
            this.size--;
            return closerElement.value;
        }
    }
}
