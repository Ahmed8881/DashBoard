// Main JavaScript for the 3D Interactive Dashboard

// DOM elements
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('.section');
const activityList = document.getElementById('activity-list');
const settingsForm = document.getElementById('dashboard-settings');
const themeSelector = document.getElementById('theme');

// Chart instances
let salesChart, regionChart, performanceChart, salesTrendChart, userGrowthChart, trafficSourcesChart;

// Sample data
const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    sales: [12500, 17800, 18400, 19250, 21000, 23500, 25800, 25000, 24100, 23000, 25500, 28000],
    users: [1200, 1350, 1500, 1800, 2100, 2400, 2800, 3200, 3600, 3950, 4300, 4800],
    expenses: [8500, 9200, 9800, 10200, 11000, 12500, 13800, 12900, 12100, 11800, 12500, 13500]
};

const regionData = {
    labels: ['North America', 'Europe', 'Asia', 'South America', 'Australia', 'Africa'],
    data: [35, 25, 20, 10, 7, 3]
};

const trafficSources = {
    labels: ['Direct', 'Organic Search', 'Referral', 'Social Media', 'Email', 'Paid Ads'],
    data: [30, 25, 15, 12, 10, 8]
};

const recentActivities = [
    { type: '💰', title: 'New Sale', description: 'New order #12345 for $230.00', time: '5 min ago' },
    { type: '👤', title: 'New User', description: 'Jane Smith has registered', time: '20 min ago' },
    { type: '📊', title: 'Report Generated', description: 'Monthly sales report is ready', time: '1 hour ago' },
    { type: '⚠️', title: 'System Alert', description: 'Server load reached 85%', time: '2 hours ago' },
    { type: '✅', title: 'Task Completed', description: 'Inventory update completed', time: '3 hours ago' }
];

// Initialize the dashboard
function initDashboard() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-section');
            
            // Update active states
            navLinks.forEach(navLink => {
                navLink.parentElement.classList.remove('active');
            });
            link.parentElement.classList.add('active');
            
            // Show the target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
            
            // Render charts if needed
            if (targetId === 'sales' && !salesTrendChart) {
                initSalesTrendChart();
            } else if (targetId === 'users' && !userGrowthChart) {
                initUserGrowthChart();
            } else if (targetId === 'traffic' && !trafficSourcesChart) {
                initTrafficSourcesChart();
            }
        });
    });
    
    // Initialize main charts
    initSalesChart();
    initRegionChart();
    initPerformanceChart();
    
    // Populate recent activities
    populateActivities();
    
    // Settings form
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const theme = themeSelector.value;
        applyTheme(theme);
        
        // Show success message
        alert('Settings saved successfully!');
    });
    
    // Add 3D hover effects
    add3DHoverEffects();
    
    // Initialize random data update
    setInterval(updateRandomData, 5000);
}

// Initialize Charts
function initSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyData.labels,
            datasets: [{
                label: 'Sales ($)',
                data: monthlyData.sales,
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initRegionChart() {
    const ctx = document.getElementById('regionChart').getContext('2d');
    
    regionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: regionData.labels,
            datasets: [{
                data: regionData.data,
                backgroundColor: [
                    '#4361ee',
                    '#3a0ca3',
                    '#4cc9f0',
                    '#f72585',
                    '#ff9e00',
                    '#38b000'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            },
            cutout: '65%'
        }
    });
}

function initPerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthlyData.labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: monthlyData.sales,
                    backgroundColor: 'rgba(67, 97, 238, 0.7)',
                    borderColor: '#4361ee',
                    borderWidth: 2
                },
                {
                    label: 'Expenses',
                    data: monthlyData.expenses,
                    backgroundColor: 'rgba(247, 37, 133, 0.7)',
                    borderColor: '#f72585',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initSalesTrendChart() {
    const ctx = document.getElementById('salesTrendChart').getContext('2d');
    
    // Create a year-over-year comparison
    const lastYearSales = monthlyData.sales.map(sale => sale * 0.7);
    
    salesTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyData.labels,
            datasets: [
                {
                    label: 'This Year',
                    data: monthlyData.sales,
                    borderColor: '#4361ee',
                    borderWidth: 3,
                    tension: 0.4,
                    pointBackgroundColor: '#4361ee',
                    pointRadius: 4
                },
                {
                    label: 'Last Year',
                    data: lastYearSales,
                    borderColor: '#adb5bd',
                    borderWidth: 3,
                    borderDash: [5, 5],
                    tension: 0.4,
                    pointBackgroundColor: '#adb5bd',
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interactions: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initUserGrowthChart() {
    const ctx = document.getElementById('userGrowthChart').getContext('2d');
    
    // Calculate cumulative user growth
    const cumulativeUsers = [];
    let total = 0;
    monthlyData.users.forEach(monthUsers => {
        total += monthUsers;
        cumulativeUsers.push(total);
    });
    
    userGrowthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyData.labels,
            datasets: [
                {
                    label: 'Monthly New Users',
                    type: 'bar',
                    data: monthlyData.users,
                    backgroundColor: 'rgba(76, 201, 240, 0.7)',
                    borderColor: '#4cc9f0',
                    borderWidth: 2,
                    yAxisID: 'y'
                },
                {
                    label: 'Total Users',
                    type: 'line',
                    data: cumulativeUsers,
                    borderColor: '#f72585',
                    borderWidth: 3,
                    pointBackgroundColor: '#f72585',
                    pointRadius: 4,
                    fill: false,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'New Users'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false
                    },
                    title: {
                        display: true,
                        text: 'Total Users'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initTrafficSourcesChart() {
    const ctx = document.getElementById('trafficSourcesChart').getContext('2d');
    
    trafficSourcesChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: trafficSources.labels,
            datasets: [{
                data: trafficSources.data,
                backgroundColor: [
                    'rgba(67, 97, 238, 0.7)',
                    'rgba(76, 201, 240, 0.7)',
                    'rgba(247, 37, 133, 0.7)',
                    'rgba(255, 158, 0, 0.7)',
                    'rgba(56, 176, 0, 0.7)',
                    'rgba(58, 12, 163, 0.7)'
                ],
                borderWidth: 1,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            },
            scales: {
                r: {
                    ticks: {
                        display: false
                    }
                }
            }
        }
    });
}

// Populate recent activities list
function populateActivities() {
    recentActivities.forEach(activity => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="activity-icon">${activity.type}</div>
            <div class="activity-details">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
            </div>
            <div class="activity-time">${activity.time}</div>
        `;
        activityList.appendChild(li);
    });
}

// Apply theme settings
function applyTheme(theme) {
    const body = document.body;
    
    if (theme === 'dark') {
        body.classList.add('dark-theme');
    } else if (theme === 'light') {
        body.classList.remove('dark-theme');
    } else if (theme === 'blue') {
        body.classList.remove('dark-theme');
        document.documentElement.style.setProperty('--primary-color', '#0077b6');
        document.documentElement.style.setProperty('--secondary-color', '#023e8a');
        document.documentElement.style.setProperty('--accent-color', '#90e0ef');
        document.documentElement.style.setProperty('--sidebar-bg', '#0077b6');
    }
    
    // Update charts if they exist
    if (salesChart) {
        updateChartsForTheme(theme);
    }
}

// Update charts for the selected theme
function updateChartsForTheme(theme) {
    // Define theme colors
    let gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    let textColor = theme === 'dark' ? '#f8f9fa' : '#333333';
    
    // Update chart configurations
    const charts = [salesChart, regionChart, performanceChart, salesTrendChart, userGrowthChart, trafficSourcesChart].filter(chart => chart);
    
    charts.forEach(chart => {
        // Update scale colors
        if (chart.options.scales) {
            Object.keys(chart.options.scales).forEach(scaleKey => {
                const scale = chart.options.scales[scaleKey];
                if (scale.grid) {
                    scale.grid.color = gridColor;
                }
                if (scale.ticks) {
                    scale.ticks.color = textColor;
                }
            });
        }
        
        // Update legend colors
        if (chart.options.plugins && chart.options.plugins.legend) {
            if (!chart.options.plugins.legend.labels) {
                chart.options.plugins.legend.labels = {};
            }
            chart.options.plugins.legend.labels.color = textColor;
        }
        
        chart.update();
    });
}

// Add 3D hover effects to cards and other elements
function add3DHoverEffects() {
    const cards = document.querySelectorAll('.card, .chart-card');
    const perspective = 1000;
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Calculate rotation values
            const rotateY = (mouseX - cardCenterX) / 10;
            const rotateX = (cardCenterY - mouseY) / 10;
            
            card.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(5px)';
            card.style.transition = 'transform 0.5s ease';
        });
    });
}

// Update random data to simulate real-time changes
function updateRandomData() {
    // Only update if charts are initialized
    if (salesChart) {
        // Get last month's data
        const lastSalesData = [...salesChart.data.datasets[0].data];
        const lastSalesValue = lastSalesData[11];
        
        // Generate a random change (-5% to +5%)
        const change = lastSalesValue * (Math.random() * 0.1 - 0.05);
        const newValue = Math.max(lastSalesValue + change, lastSalesValue * 0.9);
        
        // Shift data and add new value
        lastSalesData.shift();
        lastSalesData.push(newValue);
        
        // Update chart
        salesChart.data.datasets[0].data = lastSalesData;
        salesChart.update();
        
        // Update stat cards with new random data
        updateStatCards();
    }
}

// Update stat cards with random changes
function updateStatCards() {
    const cards = {
        sales: { elem: document.querySelector('#sales-card .stat-value'), value: 124587 },
        users: { elem: document.querySelector('#users-card .stat-value'), value: 8752 },
        orders: { elem: document.querySelector('#orders-card .stat-value'), value: 1245 },
        revenue: { elem: document.querySelector('#revenue-card .stat-value'), value: 45698 }
    };
    
    Object.keys(cards).forEach(key => {
        const card = cards[key];
        if (card.elem) {
            // Generate a small random change
            const change = card.value * (Math.random() * 0.04 - 0.02);
            const newValue = Math.round(card.value + change);
            cards[key].value = newValue;
            
            // Format numbers with commas
            const formatter = new Intl.NumberFormat('en-US', {
                style: key === 'sales' || key === 'revenue' ? 'currency' : 'decimal',
                currency: 'USD',
                maximumFractionDigits: 0
            });
            
            card.elem.textContent = formatter.format(newValue);
            
            // Update percentage change indicator
            const percentElem = card.elem.nextElementSibling;
            if (percentElem && percentElem.classList.contains('stat-change')) {
                const percentChange = ((Math.random() * 14) - 4).toFixed(1);
                percentElem.textContent = (percentChange >= 0 ? '+' : '') + percentChange + '%';
                
                if (parseFloat(percentChange) >= 0) {
                    percentElem.classList.add('positive');
                    percentElem.classList.remove('negative');
                } else {
                    percentElem.classList.add('negative');
                    percentElem.classList.remove('positive');
                }
            }
        }
    });
}

// Add custom 3D shadow effect
function add3DShadowEffect() {
    const cards = document.querySelectorAll('.card, .chart-card');
    
    cards.forEach(card => {
        card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1)';
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    add3DShadowEffect();
    
    // Add an animated startup effect
    const dashboard = document.querySelector('.dashboard');
    dashboard.style.opacity = '0';
    dashboard.style.transform = 'translateY(20px)';
    dashboard.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    setTimeout(() => {
        dashboard.style.opacity = '1';
        dashboard.style.transform = 'translateY(0)';
    }, 100);
});