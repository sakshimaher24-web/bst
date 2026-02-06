
/* ================== NODE ================== */
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;

        // animation
        this.yOffset = -25;
        this.opacity = 0;
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
        } else if (value > root.value) {
            root.right = this.insert(root.right, value);
        }
        return root;
    }

    build(values) {
        this.root = null;
        values.forEach(v => {
            this.root = this.insert(this.root, v);
        });
    }

    inorder(root, res = []) {
        if (!root) return res;
        this.inorder(root.left, res);
        res.push(root.value);
        this.inorder(root.right, res);
        return res;
    }

    preorder(root, res = []) {
        if (!root) return res;
        res.push(root.value);
        this.preorder(root.left, res);
        this.preorder(root.right, res);
        return res;
    }

    postorder(root, res = []) {
        if (!root) return res;
        this.postorder(root.left, res);
        this.postorder(root.right, res);
        res.push(root.value);
        return res;
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

/* ================== CANVAS ================== */
const canvas = document.getElementById("bstCanvas");
const ctx = canvas.getContext("2d");

const bst = new BST();
const nodePositions = new Map();

/* ================== DRAW ================== */
function drawTree(node, x, y, gap) {
    if (!node) return;

    const animatedY = y + node.yOffset;

    // animation update
    if (node.yOffset < 0) node.yOffset += 2;
    if (node.opacity < 1) node.opacity += 0.05;

    node.yOffset = Math.min(node.yOffset, 0);
    node.opacity = Math.min(node.opacity, 1);

    ctx.globalAlpha = node.opacity;

    // lines
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2;

    if (node.left) {
        ctx.beginPath();
        ctx.moveTo(x, animatedY);
        ctx.lineTo(x - gap, y + 80);
        ctx.stroke();
        drawTree(node.left, x - gap, y + 80, gap / 1.6);
    }

    if (node.right) {
        ctx.beginPath();
        ctx.moveTo(x, animatedY);
        ctx.lineTo(x + gap, y + 80);
        ctx.stroke();
        drawTree(node.right, x + gap, y + 80, gap / 1.6);
    }

    // node
    ctx.beginPath();
    ctx.arc(x, animatedY, 22, 0, Math.PI * 2);
    ctx.fillStyle = "#7DA6FF";
    ctx.fill();
    ctx.strokeStyle = "#444";
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = "14px Poppins";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.value, x, animatedY);

    ctx.globalAlpha = 1;

    nodePositions.set(node.value, { x, y: animatedY });
}

/* ================== ANIMATION LOOP ================== */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodePositions.clear();
    drawTree(bst.root, canvas.width / 2, 50, 140);
    requestAnimationFrame(animate);
}

/* ================== CONTROLS ================== */
function buildBST() {
    const input = document.getElementById("nodesInput").value;
    if (!input) return alert("Enter numbers");

    const values = input
        .split(",")
        .map(v => parseInt(v.trim()))
        .filter(v => !isNaN(v));

    bst.build(values);
    updateInfo();
}

function searchNode() {
    const val = parseInt(document.getElementById("searchInput").value);
    if (isNaN(val)) return;

    if (nodePositions.has(val)) {
        const p = nodePositions.get(val);

        ctx.beginPath();
        ctx.arc(p.x, p.y, 26, 0, Math.PI * 2);
        ctx.strokeStyle = "#FFB347";
        ctx.lineWidth = 4;
        ctx.stroke();
    } else {
        alert("Value not found");
    }
}

function deleteTree() {
    bst.root = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodePositions.clear();
    document.querySelectorAll(".output span").forEach(s => s.textContent = "");
}

function updateInfo() {
    document.getElementById("inorder").textContent = bst.inorder(bst.root).join(", ");
    document.getElementById("preorder").textContent = bst.preorder(bst.root).join(", ");
    document.getElementById("postorder").textContent = bst.postorder(bst.root).join(", ");
    document.getElementById("totalNodes").textContent = bst.countNodes(bst.root);
    document.getElementById("leafNodes").textContent = bst.countLeaves(bst.root);
    document.getElementById("height").textContent = bst.height(bst.root);
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
