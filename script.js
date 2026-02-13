/* ================== NODE ================== */
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;

        // animation properties
        this.yOffset = -25;
        this.opacity = 0;

        // search animation
        this.isVisited = false;
        this.isFound = false;
    }
}

/* ================== BST ================== */
class BST {
    constructor() {
        this.root = null;
    }

    insert(root, value) {
        if (!root) return new Node(value);

        if (value < root.value) {
            root.left = this.insert(root.left, value);
        } 
        else if (value > root.value) {
            root.right = this.insert(root.right, value);
        }
        // duplicates ignored
        return root;
    }

    build(values) {
        this.root = null;
        values.forEach(value => {
            this.root = this.insert(this.root, value);
        });
    }

    search(root, value, path = []) {
        if (!root) return path;

        path.push(root);

        if (root.value === value) return path;
        if (value < root.value)
            return this.search(root.left, value, path);
        return this.search(root.right, value, path);
    }

    inorder(root, result = []) {
        if (!root) return result;
        this.inorder(root.left, result);
        result.push(root.value);
        this.inorder(root.right, result);
        return result;
    }

    preorder(root, result = []) {
        if (!root) return result;
        result.push(root.value);
        this.preorder(root.left, result);
        this.preorder(root.right, result);
        return result;
    }

    postorder(root, result = []) {
        if (!root) return result;
        this.postorder(root.left, result);
        this.postorder(root.right, result);
        result.push(root.value);
        return result;
    }

    countNodes(root) {
        if (!root) return 0;
        return 1 + this.countNodes(root.left) + this.countNodes(root.right);
    }

    countLeaves(root) {
        if (!root) return 0;
        if (!root.left && !root.right) return 1;
        return this.countLeaves(root.left) + this.countLeaves(root.right);
    }

    height(root) {
        if (!root) return -1;
        return 1 + Math.max(this.height(root.left), this.height(root.right));
    }
}

/* ================== INITIAL SETUP ================== */
const canvas = document.getElementById("bstCanvas");
const ctx = canvas.getContext("2d");
const bst = new BST();

/* ================== DRAW TREE ================== */
function drawTree(node, x, y, gap) {
    if (!node) return;

    // animation
    node.yOffset = Math.min(node.yOffset + 2, 0);
    node.opacity = Math.min(node.opacity + 0.05, 1);

    const animatedY = y + node.yOffset;
    ctx.globalAlpha = node.opacity;

    // draw edges
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2;

    if (node.left) {
        ctx.beginPath();
        ctx.moveTo(x, animatedY + 22);
        ctx.lineTo(x - gap, y + 80);
        ctx.stroke();
        drawTree(node.left, x - gap, y + 80, gap / 1.6);
    }

    if (node.right) {
        ctx.beginPath();
        ctx.moveTo(x, animatedY + 22);
        ctx.lineTo(x + gap, y + 80);
        ctx.stroke();
        drawTree(node.right, x + gap, y + 80, gap / 1.6);
    }

    // node color logic
    let color = "#7DA6FF";
    if (node.isVisited) color = "#FFD966";
    if (node.isFound) color = "#4CAF50";

    ctx.beginPath();
    ctx.arc(x, animatedY, 22, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#444";
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = "14px Poppins";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.value, x, animatedY);

    ctx.globalAlpha = 1;
}

/* ================== ANIMATION LOOP ================== */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTree(bst.root, canvas.width / 2, 50, 140);
    requestAnimationFrame(animate);
}

/* ================== CONTROLS ================== */
function buildBST() {
    const input = document.getElementById("nodesInput").value.trim();
    if (!input) {
        alert("Please enter numbers separated by commas");
        return;
    }

    const values = input
        .split(",")
        .map(v => parseInt(v.trim()))
        .filter(v => !isNaN(v));

    if (!values.length) {
        alert("Invalid input");
        return;
    }

    bst.build(values);
    resetSearch(bst.root);

    const treeHeight = bst.height(bst.root);
    canvas.height = Math.max(500, (treeHeight + 2) * 100);

    updateInfo();
}

function searchNode() {
    const value = parseInt(document.getElementById("searchInput").value);
    if (isNaN(value)) {
        alert("Enter a valid number");
        return;
    }

    if (!bst.root) {
        alert("Tree is empty");
        return;
    }

    resetSearch(bst.root);

    const path = bst.search(bst.root, value);
    const found = path.length && path[path.length - 1].value === value
        ? path[path.length - 1]
        : null;

    animateSearch(path, found);

    if (!found) {
        setTimeout(() => alert("Value not found"), path.length * 600);
    }
}

function animateSearch(path, foundNode) {
    path.forEach((node, index) => {
        setTimeout(() => {
            node.isVisited = true;
            if (node === foundNode) node.isFound = true;
        }, index * 600);
    });
}

function resetSearch(root) {
    if (!root) return;
    root.isVisited = false;
    root.isFound = false;
    resetSearch(root.left);
    resetSearch(root.right);
}

function deleteTree() {
    bst.root = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    document.getElementById("inorder").textContent = "";
    document.getElementById("preorder").textContent = "";
    document.getElementById("postorder").textContent = "";
    document.getElementById("totalNodes").textContent = "";
    document.getElementById("leafNodes").textContent = "";
    document.getElementById("height").textContent = "";
}

function updateInfo() {
    if (!bst.root) return;

    document.getElementById("inorder").textContent =
        bst.inorder(bst.root).join(", ");
    document.getElementById("preorder").textContent =
        bst.preorder(bst.root).join(", ");
    document.getElementById("postorder").textContent =
        bst.postorder(bst.root).join(", ");
    document.getElementById("totalNodes").textContent =
        bst.countNodes(bst.root);
    document.getElementById("leafNodes").textContent =
        bst.countLeaves(bst.root);
    document.getElementById("height").textContent =
        bst.height(bst.root);
}

/* ================== DARK MODE ================== */
const toggleBtn = document.getElementById("themeToggle");

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    toggleBtn.textContent =
        document.body.classList.contains("dark")
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
});

/* ================== START ================== */
animate();
