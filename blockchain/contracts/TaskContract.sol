// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TaskContract {
    struct Task {
        uint256 id;
        string title;
        string description;
        bool completed;
        uint8 priority; // Priority: 1 (Low), 2 (Medium), 3 (High)
        uint8 progress; // Progress percentage: 0-100
        string aiAdvice; // AI-generated advice
        address owner;
        string deadline; // Deadline as a string
    }

    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;

    event TaskCreated(
        uint256 id,
        string title,
        string description,
        bool completed,
        uint8 priority,
        uint8 progress,
        string aiAdvice,
        address owner,
        string deadline
    );
    event TaskCompleted(uint256 id, bool completed);
    event TaskDeleted(uint256 id);
    event TaskEdited(
        uint256 id,
        string newTitle,
        string newDescription,
        uint8 newPriority,
        uint8 newProgress,
        string newAiAdvice,
        string newDeadline
    );

    // Create a new task
    function createTask(
        string memory _title,
        string memory _description,
        uint8 _priority,
        uint8 _progress,
        string memory _aiAdvice,
        string memory _deadline
    ) public {
        require(_priority >= 1 && _priority <= 3, "Invalid priority value");
        require(_progress <= 100, "Invalid progress value");

        taskCount++;
        tasks[taskCount] = Task(
            taskCount,
            _title,
            _description,
            false,
            _priority,
            _progress,
            _aiAdvice,
            msg.sender,
            _deadline
        );
        emit TaskCreated(
            taskCount,
            _title,
            _description,
            false,
            _priority,
            _progress,
            _aiAdvice,
            msg.sender,
            _deadline
        );
    }

    // Complete a task
    function completeTask(uint256 _id) public {
        Task storage task = tasks[_id];
        require(task.owner == msg.sender, "Not task owner");

        task.completed = !task.completed;
        emit TaskCompleted(_id, task.completed);
    }

    // Get details of a task owned by the caller
    function getTask(uint256 _id) public view returns (Task memory) {
        Task memory task = tasks[_id];
        require(task.owner == msg.sender, "Not task owner");
        return task;
    }

    // Get all tasks owned by the caller
    function getAllTasks() public view returns (Task[] memory) {
        uint256 userTaskCount = 0;

        for (uint256 i = 1; i <= taskCount; i++) {
            if (tasks[i].owner == msg.sender) {
                userTaskCount++;
            }
        }

        Task[] memory userTasks = new Task[](userTaskCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= taskCount; i++) {
            if (tasks[i].owner == msg.sender) {
                userTasks[index] = tasks[i];
                index++;
            }
        }

        return userTasks;
    }

    // Get the count of tasks owned by the caller
    function getTaskCount() public view returns (uint256) {
        uint256 userTaskCount = 0;

        for (uint256 i = 1; i <= taskCount; i++) {
            if (tasks[i].owner == msg.sender) {
                userTaskCount++;
            }
        }

        return userTaskCount;
    }

    // Delete a task owned by the caller
    function deleteTask(uint256 _id) public {
        Task storage task = tasks[_id];
        require(task.owner == msg.sender, "Not task owner");

        emit TaskDeleted(_id);
        delete tasks[_id];
    }

    // Edit a task owned by the caller
    function editTask(
        uint256 _id,
        string memory _newTitle,
        string memory _newDescription,
        uint8 _newPriority,
        uint8 _newProgress,
        string memory _newAiAdvice,
        string memory _newDeadline
    ) public {
        require(
            _newPriority >= 1 && _newPriority <= 3,
            "Invalid priority value"
        );
        require(_newProgress <= 100, "Invalid progress value");

        Task storage task = tasks[_id];
        require(task.owner == msg.sender, "Not task owner");

        task.title = _newTitle;
        task.description = _newDescription;
        task.priority = _newPriority;
        task.progress = _newProgress;
        task.aiAdvice = _newAiAdvice;
        task.deadline = _newDeadline;

        emit TaskEdited(
            _id,
            _newTitle,
            _newDescription,
            _newPriority,
            _newProgress,
            _newAiAdvice,
            _newDeadline
        );
    }
}
