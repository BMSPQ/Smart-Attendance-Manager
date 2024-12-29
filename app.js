const percentageSelect = document.getElementById("percentage");
const presentInput = document.getElementById("present-input");
const totalInput = document.getElementById("total-input");
const btn = document.getElementById("btn");
const clearBtn = document.getElementById("clear-btn");
const outputDiv = document.getElementById("output-div");
const footer = document.getElementById("footer");
const progressBar = document.getElementById("progress-bar");

// Load saved preferences
window.onload = () => {
  const savedPercentage = localStorage.getItem("percentage");
  const savedPresent = localStorage.getItem("present");
  const savedTotal = localStorage.getItem("total");

  if (savedPercentage) percentageSelect.value = savedPercentage;
  if (savedPresent) presentInput.value = savedPresent;
  if (savedTotal) totalInput.value = savedTotal;

  updateProgressBar();
};

// Save preferences to localStorage
const savePreferences = () => {
  localStorage.setItem("percentage", percentageSelect.value);
  localStorage.setItem("present", presentInput.value);
  localStorage.setItem("total", totalInput.value);
};

// Update progress bar
const updateProgressBar = () => {
  const present = parseInt(presentInput.value) || 0;
  const total = parseInt(totalInput.value) || 1;
  const percentage = ((present / total) * 100).toFixed(2);
  progressBar.style.width = `${Math.min(percentage, 100)}%`;
  progressBar.innerText = `${percentage}%`;
};

// Handle calculation button click
btn.addEventListener("click", () => {
  let present = parseInt(presentInput.value);
  let total = parseInt(totalInput.value);
  let percentage = parseInt(percentageSelect.value);

  if (isNaN(present) || isNaN(total) || isNaN(percentage)) {
    return (outputDiv.innerHTML = `<p class="error">Please enter valid numeric values.</p>`);
  }

  if (present < 0 || total <= 0 || present > total) {
    return (outputDiv.innerHTML = `<p class="error">Invalid attendance values. Ensure "Present" is not greater than "Total".</p>`);
  }

  savePreferences();

  if (present / total >= percentage / 100) {
    const daysAvailableToBunk = daysToBunk(present, total, percentage);
    return (outputDiv.innerHTML = daysToBunkText(
      daysAvailableToBunk,
      present,
      total
    ));
  }

  const attendanceNeeded = reqAttendance(present, total, percentage);
  return (outputDiv.innerHTML = daysToAttendClassText(
    attendanceNeeded,
    present,
    total,
    percentage
  ));
});

// Clear all inputs and reset
clearBtn.addEventListener("click", () => {
  presentInput.value = "";
  totalInput.value = "";
  percentageSelect.value = "75";
  outputDiv.innerHTML = "";
  progressBar.style.width = "0%";
  progressBar.innerText = "0%";
  localStorage.clear();
});

// Calculate required attendance
const reqAttendance = (present, total, percentage) => {
  return Math.ceil((percentage * total - 100 * present) / (100 - percentage));
};

// Calculate days available to bunk
const daysToBunk = (present, total, percentage) => {
  return Math.floor((100 * present - percentage * total) / percentage);
};

// Generate text for days to bunk
const daysToBunkText = (daysAvailableToBunk, present, total) =>
  `<p>You can bunk for <strong>${daysAvailableToBunk}</strong> more days.</p>
  <p>Current Attendance: <strong>${present}/${total}</strong> -> <strong>${(
    (present / total) *
    100
  ).toFixed(2)}%</strong></p>
  <p>Attendance Then: <strong>${present}/${
    daysAvailableToBunk + total
  }</strong> -> <strong>${(
    (present / (daysAvailableToBunk + total)) *
    100
  ).toFixed(2)}%</strong></p>`;

// Generate text for days to attend
const daysToAttendClassText = (attendanceNeeded, present, total, percentage) =>
  `<p>You need to attend <strong>${attendanceNeeded}</strong> more classes to attain ${percentage}% attendance.</p>
  <p>Current Attendance: <strong>${present}/${total}</strong> -> <strong>${(
    (present / total) *
    100
  ).toFixed(2)}%</strong></p>
  <p>Attendance Required: <strong>${
    attendanceNeeded + present
  }/${attendanceNeeded + total}</strong> -> <strong>${(
    ((attendanceNeeded + present) / (attendanceNeeded + total)) *
    100
  ).toFixed(2)}%</strong></p>`;

// Hide footer on input focus (mobile-friendly)
[presentInput, totalInput].forEach((input) => {
  input.addEventListener("focus", () => {
    footer.classList.add("hide-footer");
  });

  input.addEventListener("focusout", () => {
    footer.classList.remove("hide-footer");
  });

  input.addEventListener("input", updateProgressBar);
});
