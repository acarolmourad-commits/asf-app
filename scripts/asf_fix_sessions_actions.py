from pathlib import Path
p=Path('sessoes-interativas.html')
s=p.read_text()
s=s.replace('<span class="room-count">exemplo</span>','<span class="room-count">sala local</span>')
old="""        function createNewRoom() {
            const name = prompt('Nome da nova sala:');
            if (!name) return;
            alert('Sala \"' + name + '\" criada! Compartilhe o link com suas amigas! 🌊');
        }
        
        // Mostrar surfistas perto
        function showNearbySurfers() {
            alert('Funcionalidade em desenvolvimento! Em breve você poderá ver surfistas perto de você! 📍');
        }
        
        // Mostrar minhas salas
        function showMyRooms() {
            alert('Suas salas aparecerão aqui! 🌟');
        }
"""
new="""        function createNewRoom() {
            const name = prompt('Nome da nova sala:');
            if (!name || !name.trim()) return;
            const cleanName = name.trim().slice(0, 60);
            const roomId = 'custom-' + cleanName.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const customRooms = JSON.parse(localStorage.getItem('asf-custom-rooms') || '[]');
            if (!customRooms.some(room => room.id === roomId)) {
                customRooms.push({ id: roomId, name: cleanName, createdAt: new Date().toISOString() });
                localStorage.setItem('asf-custom-rooms', JSON.stringify(customRooms));
            }
            if (!localStorage.getItem('asf-room-' + roomId)) localStorage.setItem('asf-room-' + roomId, '[]');
            openRoom(roomId);
        }
        
        function showNearbySurfers() {
            window.location.href = 'https://acarolmourad-commits.github.io/asf-parceiras/';
        }
        
        function showMyRooms() {
            const customRooms = JSON.parse(localStorage.getItem('asf-custom-rooms') || '[]');
            if (customRooms.length === 0) {
                alert('Você ainda não criou salas neste dispositivo. Toque em \"+ Criar Sala\" para começar. 🌟');
                return;
            }
            const names = customRooms.map(room => '• ' + room.name).join('\\n');
            alert('Suas salas locais:\\n\\n' + names);
        }
"""
if old not in s:
    print('Trecho-alvo não encontrado; nenhuma alteração aplicada.')
else:
    p.write_text(s.replace(old,new))
    print('Sessões interativas atualizadas.')
