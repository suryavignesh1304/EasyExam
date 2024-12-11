import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Define the workflow steps and connections
workflow_steps = [
    "Frontend Setup (Vite + React + TSX)",
    "Image Upload & Preview Component",
    "Form to Collect Data",
    "Backend Setup (Flask + Python)",
    "Handle Image Upload via API",
    "Store Metadata (Optional: Database)",
    "Deployment"
]

connections = [
    ("Frontend Setup (Vite + React + TSX)", "Image Upload & Preview Component"),
    ("Frontend Setup (Vite + React + TSX)", "Form to Collect Data"),
    ("Image Upload & Preview Component", "Form to Collect Data"),
    ("Form to Collect Data", "Backend Setup (Flask + Python)"),
    ("Backend Setup (Flask + Python)", "Handle Image Upload via API"),
    ("Handle Image Upload via API", "Store Metadata (Optional: Database)"),
    ("Store Metadata (Optional: Database)", "Deployment"),
]

# Plotting the workflow diagram
fig, ax = plt.subplots(figsize=(10, 6))

# Draw connections
for connection in connections:
    step1, step2 = connection
    ax.annotate("", xy=(step1_pos[step1]), xytext=(step1_pos[step2]), 
                arrowprops=dict(arrowstyle="->", lw=2))

# Draw rectangles for steps
step1_pos = {}
for i, step in enumerate(workflow_steps):
    step1_pos[step] = (1, 6 - 1.5 * i)
    ax.add_patch(patches.Rectangle((0.5, 6 - 1.5 * i - 0.3), 1, 0.6, color='lightblue'))
    ax.text(1.25, 6 - 1.5 * i, step, fontsize=12, verticalalignment='center')

# Set limits and labels
ax.set_xlim(0, 2)
ax.set_ylim(0, 7)
ax.set_yticks(range(1, 7))
ax.set_xticks([])
ax.set_title("Workflow Diagram: Image Data Web Application")

plt.show()
