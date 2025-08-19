document.addEventListener('DOMContentLoaded', function() {
    const authForm = document.getElementById('auth-form');
    const toggleAuthLink = document.getElementById('toggle-auth');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const formError = document.getElementById('form-error');

    let isLogin = true; // 初始状态为登录

    // 切换登录/注册表单
    toggleAuthLink.addEventListener('click', function() {
        isLogin = !isLogin;
        emailError.textContent = '';
        passwordError.textContent = '';
        formError.textContent = '';

        if (isLogin) {
            formTitle.textContent = '用户登录';
            submitButton.textContent = '登录';
            toggleAuthLink.textContent = '立即注册';
            // 移除注册特有的字段，例如确认密码（如果存在）
            const confirmPasswordGroup = document.getElementById('confirm-password-group');
            if (confirmPasswordGroup) {
                confirmPasswordGroup.remove();
            }
        } else {
            formTitle.textContent = '用户注册';
            submitButton.textContent = '注册';
            toggleAuthLink.textContent = '立即登录';
            // 添加注册特有的字段，例如确认密码
            const confirmPasswordGroup = document.createElement('div');
            confirmPasswordGroup.className = 'input-group';
            confirmPasswordGroup.id = 'confirm-password-group';
            confirmPasswordGroup.innerHTML = `
                <input type="password" id="confirm-password" placeholder="确认密码" required>
                <span class="error-message" id="confirm-password-error"></span>
            `;
            passwordInput.parentNode.after(confirmPasswordGroup);
        }
    });

    // 表单提交处理
    authForm.addEventListener('submit', function(event) {
        event.preventDefault(); // 阻止表单默认提交行为

        emailError.textContent = '';
        passwordError.textContent = '';
        formError.textContent = '';

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;

        if (!email) {
            emailError.textContent = '邮箱不能为空。';
            isValid = false;
        }
        if (!password) {
            passwordError.textContent = '密码不能为空。';
            isValid = false;
        }

        if (!isLogin) { // 如果是注册模式
            const confirmPasswordInput = document.getElementById('confirm-password');
            const confirmPasswordError = document.getElementById('confirm-password-error');
            confirmPasswordError.textContent = '';

            if (!confirmPasswordInput || !confirmPasswordInput.value.trim()) {
                confirmPasswordError.textContent = '请确认密码。';
                isValid = false;
            } else if (password !== confirmPasswordInput.value.trim()) {
                confirmPasswordError.textContent = '两次输入的密码不一致。';
                isValid = false;
            }
        }

        if (!isValid) {
            return; // 如果有验证错误，停止提交
        }

        const endpoint = isLogin ? '/api/login' : '/api/register'; // 假设的后端API路径
        const data = { email, password };
        if (!isLogin) {
            data.confirmPassword = document.getElementById('confirm-password').value.trim();
        }

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                // 如果响应状态码不是2xx，抛出错误
                return response.json().then(err => Promise.reject(err));
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert(formTitle.textContent + '成功！');
                // 可以在这里进行页面重定向或UI更新
                // 例如：window.location.href = '/dashboard';
            } else {
                formError.textContent = data.message || '操作失败，请重试。';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            formError.textContent = error.message || '网络错误或服务器无响应。';
        });
    });
});
